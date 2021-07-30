const fs = require("fs")
const Category = require("../../models/Category")
const upload = require("../../middleware/upload")
const { checkValid, checkValidImage } = require("../../helpers/")
const Post = require("../../models/Post")

const page = {
  title: "Новый пост",
  heading: "Новый пост",
  actionBtnText: "Создать пост",
}

module.exports = router => {
  router.get("/profile/add", async (req, res) => {
    const categories = await Category.find({}).lean()
    res.render("profile-add-edit-post", {
      page,
      categories,
      layout: "profile-no-sidebar",
    })
  })

  router.post("/profile/add", upload.single('image'), async (req, res) => {
    const categories = await Category.find({}).lean()
    const image = req.file
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

    if (!image) {
      errors.image = "Выберите превью поста"
    } else {
      valid = checkValidImage("post", image)
      if (valid !== true) {
        errors.image = valid
      }

      if (Object.keys(errors).length) {
        fs.unlinkSync(image.path)
      }
    }

    if (Object.keys(errors).length) {
      res.render("profile-add-edit-post", {
        page,
        categories,
        errors,
        layout: "profile-no-sidebar",
        fields: { title, excerpt, text, category }
      })
    } else {
      // ошибок нет, можно добавить пост
      const imageSrc = `${image.destination.split("public/").join("/")}/${image.filename}`
      
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