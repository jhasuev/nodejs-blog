const Post = require("../models/Post")
const Category = require("../models/Category")

class Categories {
  getAllCategories(req, { params, includePostsCount }) {
    return new Promise(async resolve => {
      const categories = await Category.find({}).lean()
      let count = categories.length
      if (!count) {
        return resolve(categories)
      }

      if (includePostsCount) {
        categories.forEach(async category => {
          category.postsCount = await Post.count({ categoryId: category._id, ...Object(params) })
          if (req.params.category == category.slug) {
            category.active = true
          }
          if (--count <= 0) {
            resolve(categories)
          }
        })
      } else {
        resolve(categories)
      }
    })
  }

  getById(categoryId) {
    return new Promise(async resolve => {
      let category = await Category.findById(categoryId).lean()
      resolve(category)
    })
  }
}

module.exports = new Categories()