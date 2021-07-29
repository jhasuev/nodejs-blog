const config = require("../config")
const Post = require("../models/Post")
const Category = require("../models/Category")
const Comment = require("../models/Comment")

module.exports = {
  checkValid: (cat, type, value) => {
    if (config[cat][type].minLength && config[cat][type].minLength > value.length) {
      return `Поле должно иметь не менее ${config[cat][type].minLength} символов`
    }
    if (config[cat][type].maxLength && config[cat][type].maxLength < value.length) {
      return `Поле должно иметь не более ${config[cat][type].maxLength} символов`
    }
    return true
  },
  
  checkValidImage(cat, image){
    const imageType = image.mimetype.split("/").pop()
    if (!config[cat].image.types.includes(imageType)) {
      return "Неверный формат файла"
    }
    return true
  },

  getPagination: (page, count, root = '/') => {
    page = Number(page) || 1
    const max = config.maxPerPage
    const skip = max * (page - 1)
    const pagesCount = Math.ceil(count / max)
    const pages = []

    if (pagesCount > 1) {
      for (let i = 1; i <= pagesCount; i++) {
        pages.push({
          page: i,
          active: i === page,
        })
      }
    }

    return { page, pages, skip, root }
  },

  getAllCategories({params, includePostsCount}) {
    return new Promise(async resolve => {
      const categories = await Category.find({}).lean()
      let count = categories.length
      if (!count) {
        return resolve(categories)
      }

      if (includePostsCount) {
        categories.forEach(async category => {
          category.postsCount = await Post.count({ categoryId: category._id, ...Object(params) })
          if (--count <= 0) resolve(categories)
        })
      } else {
        resolve(categories)
      }
    })
  },

  getPosts({ params, skip }) {
    return new Promise(async resolve => {
      const posts = await Post.find(params).lean().skip(skip).limit(config.maxPerPage)
      let postsCount = posts.length

      if (!postsCount) {
        return resolve(posts)
      }

      const categories = await Category.find({}).lean()
      posts.forEach(async post => {
        post.category = categories.find(cat => cat._id == post.categoryId)
        post.commentsCount = await Comment.count({ postId: post._id })
        
        if (--postsCount <= 0) {
          resolve(posts)
        }
      })
    })
  }
}