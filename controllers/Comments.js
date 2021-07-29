const Post = require("../models/Post")
const Comment = require("../models/Comment")
const Category = require("../models/Category")
const User = require("../models/User")
const config = require("../config")
const url = require("url")

class Posts {
  getComments(postId) {
    return new Promise(async resolve => {
      const comments = await Comment.find({ postId }).lean()
      resolve(comments)
    })
  }

  addComment(data) {
    return new Promise(async resolve => {
      const comment = Comment(data)
      await comment.save()
      resolve(comment)
    })
  }
}

module.exports = new Posts()