const Categories = require("../../controllers/Categories")
const Posts = require("../../controllers/Posts")

module.exports = router => {
  router.get("/search", async (req, res) => {
    let search = String(req.query.s).trim()
    let regex = new RegExp(search, 'i')
    
    const params = {
      $or: [
        { title: regex },
        { excerpt: regex },
        { text: regex },
      ]
    }

    const count = await Posts.getCount(params)

    const categories = await Categories.getAllCategories(req, { includePostsCount: true })
    const pagination = await Posts.getPagination(req, params)
    const posts = await Posts.getPosts(req, params)
    const recentPosts = await Posts.getRecentPosts()
    const popularPosts = await Posts.getPopularPosts()

    
    res.render("search", {
      posts,
      pagination,
      count,
      search,
      recentPosts,
      popularPosts,
      authed: req.session.userId,
      categories: { list: categories },
    })
  })
}