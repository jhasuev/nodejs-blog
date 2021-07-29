const Categories = require("../../controllers/Categories")
const Posts = require("../../controllers/Posts")

module.exports = router => {
  router.get(["/", "/category/:category"], async (req, res) => {
    const params = {}

    const categories = await Categories.getAllCategories(req, { includePostsCount: true })
    const pagination = await Posts.getPagination(req, params)
    const posts = await Posts.getPosts(req, params)
    const recentPosts = await Posts.getRecentPosts()
    const popularPosts = await Posts.getPopularPosts()

    res.render("index", {
      posts,
      recentPosts,
      popularPosts,
      pagination,
      authed: req.session.userId,
      categories: { list: categories },
    })
  })
}