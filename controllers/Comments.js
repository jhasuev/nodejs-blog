const Comment = require("../models/Comment")
const User = require("../models/User")
const config = require("../config")
const moment = require("moment")

class Posts {
  getComments(postId) {
    return new Promise(async resolve => {
      const comments = await Comment.find({ postId }).lean()
      let commentsCount = comments.length

      if (!commentsCount) {
        return resolve(comments)
      }

      comments.forEach(async comment => {
        comment.user = await User.findById(comment.userId).lean()
        comment.created = moment(comment.created).format(config.dateFormat)

        if (--commentsCount <= 0) {
          resolve(comments)
        }
      })
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