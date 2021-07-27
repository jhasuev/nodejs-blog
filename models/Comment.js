const { Schema, model } = require("mongoose")

const schema = Schema({
  userId: { type: String, required: true },
  postId: { type: String, required: true },
  text: { type: String, required: true, minLength: 2, maxLength: 2270 },
  created: { type: Date, default: Date.now },
})

module.exports = model("Comment", schema)