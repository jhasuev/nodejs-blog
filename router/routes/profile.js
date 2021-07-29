const Categories = require("../../controllers/Categories")
const Posts = require("../../controllers/Posts")

module.exports = router => {
  router.get(["/profile", "/profile/category/:category"], async (req, res) => {
    const params = {
      userId: req.session.userId
    }

    const categories = await Categories.getAllCategories(req, { params, includePostsCount: true })
    const pagination = await Posts.getPagination(req, params)
    const posts = await Posts.getPosts(req, params)

    res.render("profile", {
      posts,
      pagination,
      categories: { list: categories, root: "/profile/category/" },
      layout: "profile",
    })
  })
}