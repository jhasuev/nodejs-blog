const Posts = require("../../controllers/Posts")
const Post = require("../../models/Post")
const Comment = require("../../models/Comment")
const { checkValid } = require("../../helpers/")
const Categories = require("../../controllers/Categories")

module.exports = router => {
  router.get("/post/:_id", async (req, res) => {
    const post = await Post.findById(req.params._id).lean()
    if (!post) return res.redirect("/")
    const categories = await Categories.getAllCategories(req, { includePostsCount: true })

    const comments = await Comment.find({ postId: post._id }).lean()
    post.category = await Categories.getById(post.categoryId)
    post.commentsCount = comments.length

    const recentPosts = await Posts.getRecentPosts()
    const popularPosts = await Posts.getPopularPosts()

    // увеличиваем счетчик просмотра
    await Post.findByIdAndUpdate(post._id, { views: post.views + 1 })

    res.render("post", {
      post,
      comments,
      recentPosts,
      popularPosts,
      authed: req.session.userId,
      categories: { list: categories },
    })
  })

  // роут добавление комментария
  router.post("/post/:_id", async (req, res) => {
    if (!req.session.userId) return res.redirect("/")
    const post = await Post.findById(req.params._id).lean()
    if (!post) return res.redirect("/")

    const categories = await Categories.getAllCategories(req, { includePostsCount: true })

    const text = req.body.text.trim()
    const errors = {}
    let valid = null

    valid = checkValid("comment", "text", text)
    if (valid !== true) errors.text = valid

    const recentPosts = await Posts.getRecentPosts()
    const popularPosts = await Posts.getPopularPosts()

    if(Object.keys(errors).length) {
      res.render("post", {
        post,
        errors,
        recentPosts,
        popularPosts,
        authed: req.session.userId,
        categories: { list: categories },
      })
    } else {
      const comment = Comment({
        text,
        userId: req.session.userId,
        postId: post._id,
      })
      await comment.save()
      res.redirect(`${req.url}#${comment._id}`)
    }
  })
}