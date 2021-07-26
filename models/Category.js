const { Schema, model } = require("mongoose")

const schema = Schema({
  slug: {
    type: String,
    unique: true,
    minLength: 1,
    maxLength: 50,
  },
  title: {
    type: String,
    unique: true,
    minLength: 1,
    maxLength: 50,
  },
})

module.exports = model("Category", schema)