const { Schema, model } = require("mongoose")

const schema = Schema({
  login: {
    type: String,
    unique: true,
    required: true,
    minLength: 3,
    maxLength: 27,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 27
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50
  },
  created: {
    type: Date,
    default: Date.now
  },
})

module.exports = model("User", schema)