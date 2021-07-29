const Post = require("../models/Post")
const Comment = require("../models/Comment")
const Category = require("../models/Category")
const User = require("../models/User")
const config = require("../config")
const url = require("url")

class Posts {
  getPosts(req, params = {}) {
    return new Promise(async resolve => {
      const categorySlug = String(req.params.category).trim()
      let category = null

      if (categorySlug) {
        category = await Category.findOne({ slug: categorySlug })
        if (category) params.categoryId = category._id
      }

      const skip = config.maxPerPage * (Math.abs(Number(req.query.page) || 1) - 1)
      const posts = await Post.find(params).sort({ created: -1 }).skip(skip).limit(config.maxPerPage).lean()
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
  
  getRecentPosts() {
    return new Promise(async resolve => {
      const posts = await Post.find().sort({ created: -1 }).limit(config.recentPostsMax).lean()
      resolve(posts)
    })
  }
  
  getPopularPosts() {
    return new Promise(async resolve => {
      const posts = await Post.find().sort({ views: -1 }).limit(config.popularPostsMax).lean()
      resolve(posts)
    })
  }

  getCount(params) {
    return new Promise(async resolve => {
      let count = await Post.count(params)
      resolve(count)
    })
  }

  getPagination(req, params = {}){
    return new Promise(async resolve => {
      const categorySlug = String(req.params.category).trim()
      let category = null

      if (categorySlug) {
        category = await Category.findOne({ slug: categorySlug }).lean()
        if (category) params.categoryId = category._id
      }

      const count = await this.getCount(params)
      let root = '/'
      if (category) root += categorySlug

      const page = Number(req.query.page) || 1
      const max = config.maxPerPage
      const skip = max * (page - 1)
      const pagesCount = Math.ceil(count / max)
      const pages = []
      

      if (pagesCount > 1) {
        for (let i = 1; i <= pagesCount; i++) {
          let { pathname, query } = url.parse(req.url, true)
          query.page = i

          pages.push({
            url: url.format({ pathname, query }),
            page: i,
            active: i == page,
          })
        }
      }

      resolve({ page, pages, skip, root })
    })
  }
}

module.exports = new Posts()