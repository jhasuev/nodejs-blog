const Post = require("../models/Post")
const Category = require("../models/Category")

class CategoryClass {
  getAllCategories(includePostsCount = false) {
    return new Promise(async resolve => {
      const categories = await Category.find({}).lean()

      if (includePostsCount) {
        let count = categories.length
        categories.forEach(async category => {
          category.postsCount = await Post.count({ categoryId: category._id })
          if (--count <= 0) resolve(categories)
        })
      } else {
        resolve(categories)
      }
    })
  }

  getCategory(params) {
    return new Promise(async resolve => {
      const category = await Category.findOne(params)
      resolve(category)
    })
  }
}


module.exports = new CategoryClass()
