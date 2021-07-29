const Post = require("../../models/Post")
const Comment = require("../../models/Comment")
const Category = require("../../classes/Category")
const config = require("../../config")
const { getPagination } = require("../../helpers/index")

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


    // категории
    const categories = await Category.getAllCategories(true)
    const categorySlug = String(req.params.category).trim()
    let categoryId = null

    if (categorySlug) {
      categoryId = await Category.getCategory({ slug: categorySlug })
      if (categoryId) findParams.categoryId = categoryId._id
    }

    // пагинация
    const count = await Post.count(findParams)
    const pagination = getPagination(req.query.page, count)
    if (categoryId) pagination.root += categorySlug


    //посты
    const posts = await Post.find(findParams).lean().skip(pagination.skip).limit(config.maxPerPage)
    await (() => {
      return new Promise(async resolve => {
        if (!posts.length) resolve()
        let postsCount = posts.length
        posts.forEach(async post => {
          post.category = categories.find(cat => cat._id == post.categoryId)
          post.commentsCount = await Comment.count({ postId: post._id })
          if (--postsCount <= 0) resolve()
        })
      })
    })()

    
    res.render("search", {
      posts,
      pagination,
      count,
      search,
      categories: { list: categories, root: "/category/" },
    })
  })
}