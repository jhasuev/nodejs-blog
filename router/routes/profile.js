const Post = require("../../models/Post")
const Category = require("../../models/Category")
const { getPagination, getAllCategories, getPosts } = require("../../helpers/index")

module.exports = router => {
  router.get(["/profile", "/profile/category/:category"], async (req, res) => {

    // категории
    const findParams = {
      userId: req.session.userId
    }
    const categories = await getAllCategories({ params: findParams, includePostsCount: true, })
    const categorySlug = String(req.params.category).trim()
    let categoryId = null

    if (categorySlug) {
      categoryId = await Category.findOne({ slug: categorySlug })
      if (categoryId) findParams.categoryId = categoryId._id
    }

    // пагинация
    const count = await Post.count(findParams)
    const pagination = getPagination(req.query.page, count, "/profile/")
    if (categoryId) pagination.root += categorySlug


    //посты
    const posts = await getPosts({ params: findParams, skip: pagination.skip })

    res.render("profile", {
      posts,
      pagination,
      categories: { list: categories, root: "/profile/category/" },
      layout: "profile",
    })
  })
}