const Category = require("../../models/Category")
const Post = require("../../models/Post")
const Comment = require("../../models/Comment")

module.exports = router => {
  router.get("/post/:_id", async (req, res) => {
    const post = await Post.findById(req.params._id).lean()
    if (!post) return res.redirect("/")

    post.category = await Category.findById(post.categoryId).lean()
    post.commentsCount = await Comment.count({ postId: post._id })

    // увеличиваем счетчик просмотра
    await Post.findByIdAndUpdate(post._id, { views: post.views + 1 })

    res.render("post", {
      post,
    })
  })
}