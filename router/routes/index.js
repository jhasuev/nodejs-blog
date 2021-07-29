const Categories = require("../../controllers/Categories")
const Posts = require("../../controllers/Posts")

module.exports = router => {
  router.get(["/", "/category/:category"], async (req, res) => {
    const params = {}

    const categories = await Categories.getAllCategories(req, { includePostsCount: true })
    const pagination = await Posts.getPagination(req, params)
    const posts = await Posts.getPosts(req, params)

    res.render("index", {
      posts,
      pagination,
      authed: req.session.userId,
      categories: { list: categories },
    })
  })
}