const Post = require("../models/Post")
const Comment = require("../models/Comment")
const Category = require("../models/Category")
const User = require("../models/User")
const config = require("../config")

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
}

module.exports = new Categories()