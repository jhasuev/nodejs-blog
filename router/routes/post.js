const Posts = require("../../controllers/Posts")
const Comments = require("../../controllers/Comments")
const Categories = require("../../controllers/Categories")
const { checkValid } = require("../../helpers/")

module.exports = router => {
  router.get("/post/:_id", async (req, res) => {
    const post = await Posts.getPost(req.params._id)
    if (!post) return res.redirect("/")
    
    const categories = await Categories.getAllCategories(req, { includePostsCount: true })
    const comments = await Comments.getComments(post._id)

    const recentPosts = await Posts.getRecentPosts()
    const popularPosts = await Posts.getPopularPosts()

    // увеличиваем счетчик просмотра
    if (req.session.lastWatchPostId != post._id) {
      await Posts.updatePostViews(post)
      req.session.lastWatchPostId = post._id
    }

    res.render("post", {
      post,
      comments,
      recentPosts,
      popularPosts,
      authed: req.session.userId,
      page: { title: post.title, description: post.excerpt },
      categories: { list: categories },
    })
  })

  // роут добавление комментария
  router.post("/post/:_id", async (req, res) => {
    if (!req.session.userId) return res.redirect("/")
    const post = await Posts.getPost(req.params._id)
    if (!post) return res.redirect("/")
    
    const text = req.body.text.trim()
    const errors = {}
    let valid = null
    
    valid = checkValid("comment", "text", text)
    if (valid !== true) errors.text = valid
    
    if(Object.keys(errors).length) {
      const categories = await Categories.getAllCategories(req, { includePostsCount: true })
      const comments = await Comments.getComments(post._id)
      const recentPosts = await Posts.getRecentPosts()
      const popularPosts = await Posts.getPopularPosts()

      res.render("post", {
        errors,

        post,
        comments,
        recentPosts,
        popularPosts,
        page: { title: post.title, description: post.excerpt },
        authed: req.session.userId,
        categories: { list: categories },
      })
    } else {
      const comment = await Comments.addComment({
        text,
        userId: req.session.userId,
        postId: post._id,
      })
      res.redirect(`${req.url}#${comment._id}`)
    }
  })
}