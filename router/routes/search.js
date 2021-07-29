const Categories = require("../../controllers/Categories")
const Posts = require("../../controllers/Posts")

module.exports = router => {
  router.get("/search", async (req, res) => {
    let search = String(req.query.s).trim()
    let regex = new RegExp(search, 'i')
    
    const findParams = {
      $or: [
        { title: regex },
        { excerpt: regex },
        { text: regex },
      ]
    }

    const count = await Posts.getCount(findParams)

    const categories = await Categories.getAllCategories(req, { includePostsCount: true })
    const pagination = await Posts.getPagination(req, findParams)
    const posts = await Posts.getPosts(req, findParams)

    
    res.render("search", {
      posts,
      pagination,
      count,
      search,
      categories: { list: categories, root: "/category/" },
    })
  })
}