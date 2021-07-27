const config = require("../config")

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

  getPagination: (page, count) => {
    const max = config.maxPerPage
    const skip = max * (page - 1)
    const pagesCount = Math.ceil(count / max)
    const pages = []

    if (pagesCount > 1) {
      for (let i = 1; i <= pagesCount; i++) {
        pages.push({
          page: i,
          active: i === page,
        })
      }
    }

    return { page, pages, skip }
  }
}