const Category = require("./models/Category")

const categories = [
  { slug: "programming", title: "Программирование" },
  { slug: "running", title: "Бег" },
  { slug: "football", title: "Футбол" },
  { slug: "gardening", title: "Садоводство" },
  { slug: "travel", title: "Путешествие" },
  { slug: "games", title: "Игры" },
  { slug: "hitch-hiking", title: "Автостоп" },
  { slug: "couchsurfing", title: "Каучсёрфинг" },
  { slug: "dreams", title: "Сны" },
  { slug: "movies", title: "Кино" },
  { slug: "self-discipline", title: "Самодисциплина" },
  { slug: "different", title: "Разное" },
]

const addCategories = () => {
  let count = categories.length
  return new Promise(resolve => {
    categories.forEach(async _category => {
      const category = new Category(_category)
      await category.save()
      console.log("category migrated", _category)

      if (--count === 0) {
        console.log("=========== FINISHED")
        resolve()
      }
    })
  })
}

const start = () => {
  return new Promise(async resolve => {
    let addedAnyMigrations = false
    const categoriesCount = await Category.count({})
    if (!categoriesCount) {
      await addCategories()
      addedAnyMigrations = true
    }

    if (addedAnyMigrations) {
      console.log("all migrations finished")
    }
    resolve()
  })
}

module.exports = start