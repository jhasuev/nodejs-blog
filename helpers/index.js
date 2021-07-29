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
}