const Category = require("../../models/Category")
const upload = require("../../upload")
const { checkValid } = require("../../helper")
const Post = require("../../models/Post")

module.exports = router => {
  router.get("/profile/add", async (req, res) => {
    const categories = await Category.find({}).lean()
    res.render("profile-add-post", { layout: "profile-no-sidebar", categories })
  })

  router.post("/profile/add", upload.single('image'), async (req, res) => {
    const categories = await Category.find({}).lean()
    const title = req.body.title.trim()
    const excerpt = req.body.excerpt.trim()
    const text = req.body.text.trim()
    const category = req.body.category.trim()
    const errors = {}
    let valid = null

    valid = checkValid("post", "title", title)
    if (valid !== true) errors.title = valid

    valid = checkValid("post", "excerpt", excerpt)
    if (valid !== true) errors.excerpt = valid

    valid = checkValid("post", "text", text)
    if (valid !== true) errors.text = valid

    let selectedCategory = null
    if (!category) {
      errors.category = "Выберите категорию"
    } else {
      selectedCategory = await Category.findOne({ slug: category })
      if (!selectedCategory) errors.category = "Такой категории нет"
    }

    if (!req.file) {
      errors.image = "Выберите превью поста"
    } else if (Object.keys(errors).length) {
      // TODO: удалить превью, нету смысла хранить его
    }

    if (Object.keys(errors).length) {
      // ошибок нет, можно добавить пост
      res.render("profile-add-post", {
        categories,
        errors,
        layout: "profile-no-sidebar",
        fields: { title, excerpt, text, category }
      })
    } else {
      // ошибок нет, можно добавить пост
      const imageSrc = `${req.file.destination.split("public/").join("/")}/${req.file.filename}`
      
      const post = new Post({
        title,
        imageSrc,
        excerpt,
        text,
        userId: req.session.userId,
        categoryId: selectedCategory._id,
      })
      await post.save()
      res.redirect("/profile")
    }
  })
}