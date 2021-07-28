const fs = require("fs")
const path = require("path")
const Category = require("../../models/Category")
const upload = require("../../middleware/upload")
const { checkValid, checkValidImage } = require("../../helpers/")
const Post = require("../../models/Post")

const pageParams = {
  heading: "Редактирование",
  actionBtnText: "Изменить",
}

module.exports = router => {
  router.get("/profile/edit/:id", async (req, res) => {
    const post = await Post.findById(req.params.id).lean()
    if (!post) return res.redirect("/profile")

    const categories = await Category.find({}).lean()
    const category = await Category.findById(post.categoryId).lean()

    res.render("profile-add-edit-post", {
      ...pageParams,
      categories,
      updated: req.session.updated,
      fields: { ...post, category: category.slug },
      layout: "profile-no-sidebar",
    })

    req.session.updated = false
  })

  router.post("/profile/edit/:id", upload.single('image'), async (req, res) => {
    const post = await Post.findById(req.params.id).lean()

    const categories = await Category.find({}).lean()
    const image = req.file
    let imageSrc = String(req.body.imageSrc).trim()
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

    if (image || !imageSrc) {
      if (!image) {
        errors.image = "Выберите превью поста"
      } else {
        valid = checkValidImage("post", image)
        if (valid !== true) {
          errors.image = valid
        }
      }

      imageSrc = `${image.destination.split("public/").join("/")}/${image.filename}`
    }

    if (Object.keys(errors).length) {
      if (image) {
        try {
          fs.unlinkSync(path.join("public", image.path))
        } catch (e) { }
      }
      
      res.render("profile-add-edit-post", {
        ...pageParams,
        categories,
        errors,
        layout: "profile-no-sidebar",
        fields: { title, excerpt, text, category, imageSrc }
      })
    } else {
      // ошибок нет, можно добавить пост
      const update = {}
      if (post.title != title) update.title = title
      if (post.imageSrc != imageSrc) {
        // удаляем предыдущее превью
        try {
          fs.unlinkSync(path.join("public", post.imageSrc))
        } catch(e){}
        update.imageSrc = imageSrc
      }
      if (post.excerpt != excerpt) update.excerpt = excerpt
      if (post.text != text) update.text = text
      if (post.categoryId != selectedCategory._id) update.categoryId = selectedCategory._id

      if(Object.keys(update).length) {
        await Post.findOneAndUpdate({
          userId: req.session.userId,
          _id: post._id,
        }, update)

        req.session.updated = true
      }
      res.redirect(req.url)
    }
  })
}