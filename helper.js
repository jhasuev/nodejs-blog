const config = require("./config")

module.exports = {
  checkValid: (type, value) => {
    if (config.form[type].minLength && config.form[type].minLength > value.length) {
      return `Поле должно иметь не менее ${config.form[type].minLength} символов`
    }
    if (config.form[type].maxLength && config.form[type].maxLength < value.length) {
      return `Поле должно иметь не более ${config.form[type].maxLength} символов`
    }
    return true
  },
}