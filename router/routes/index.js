const Categories = require("../../controllers/Categories")
const Posts = require("../../controllers/Posts")

module.exports = router => {
  router.get(["/", "/category/:category"], async (req, res) => {
    const findParams = {}

    const categories = await Categories.getAllCategories(req, { includePostsCount: true })
    const pagination = await Posts.getPagination(req, findParams)
    const posts = await Posts.getPosts(req, findParams)

    res.render("index", {
      posts,
      pagination,
      categories: { list: categories, root: "/category/" }, // TODO: в шаблоне использовать "/category/" как основу
    })
  })
}