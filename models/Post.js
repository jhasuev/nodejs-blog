const { Schema, model } = require("mongoose")

const schema = Schema({
  userID: {
    type: String,
    required: true,
  },
  categoryID: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 100,
  },
  excerpt: {
    type: String,
    required: true,
    minLength: 50,
    maxLength: 227,
  },
  text: {
    type: String,
    required: true,
    minLength: 227,
    maxLength: 22700,
  },
  views: {
    type: Number,
    default: 0,
  },
  created: {
    type: Date,
    default: Date.now
  },
  publish: {
    type: Boolean,
    default: true
  },
})

module.exports = model("Post", schema)