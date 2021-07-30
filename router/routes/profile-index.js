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

    const page = { title: "Профиль" }
    const category = await Categories.getCategory(req.params.category)
    if (category) {
      page.title = `Профиль > ${category.title}`
    }

    res.render("profile", {
      page,
      posts,
      pagination,
      isProfilePage: true,
      categories: { list: categories, root: "/profile" },
      layout: "profile",
    })
  })
}