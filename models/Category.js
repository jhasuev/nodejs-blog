const { Schema, model } = require("mongoose")

const schema = Schema({
  userID: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    minLength: 1,
    maxLength: 50,
  },
  title: {
    type: String,
    minLength: 1,
    maxLength: 50,
  },
  desc: {
    type: String,
    minLength: 50,
    maxLength: 227,
  },
  active: {
    type: Boolean,
    default: false,
  },
})

module.exports = model("Category", schema)