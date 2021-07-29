const CategoryModel = require("../../models/Category")
// const Category = require("../../models/Category")
const Post = require("../../models/Post")
const Comment = require("../../models/Comment")
const { checkValid, getAllCategories } = require("../../helpers/")

module.exports = router => {
  router.get("/post/:_id", async (req, res) => {
    const post = await Post.findById(req.params._id).lean()
    if (!post) return res.redirect("/")
    const categories = await getAllCategories({ includePostsCount: true })

    const comments = await Comment.find({ postId: post._id }).lean()
    post.category = await CategoryModel.findById(post.categoryId).lean()
    post.commentsCount = comments.length

    // увеличиваем счетчик просмотра
    await Post.findByIdAndUpdate(post._id, { views: post.views + 1 })

    res.render("post", {
      post,
      comments,
      categories: { list: categories, root: "/category/" },
    })
  })

  // роут добавление комментария
  router.post("/post/:_id", async (req, res) => {
    const post = await Post.findById(req.params._id).lean()
    if (!post) return res.redirect("/")

    const categories = await getAllCategories({ includePostsCount: true })

    const text = req.body.text.trim()
    const errors = {}
    let valid = null

    valid = checkValid("comment", "text", text)
    if (valid !== true) errors.text = valid

    if(Object.keys(errors).length) {
      res.render("post", {
        post,
        errors,
        categories: { list: categories, root: "/category/" },
      })
    } else {
      const comment = Comment({
        text,
        userId: "60fddf38331e9b0fd4e10fe3",
        postId: post._id,
      })
      await comment.save()
      res.redirect(`${req.url}#${comment._id}`)
    }
  })
}