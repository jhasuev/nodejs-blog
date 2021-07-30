const User = require("../../models/User")
const { checkValid } = require("../../helpers/")
const page = { title: "Войти", description: "Вход на сайт" }

module.exports = router => {
  router.get("/login", (req, res) => {
    res.render("login", {
      page,
      layout: "main-no-sidebar",
    })
  })

  router.post("/login", async (req, res) => {
    const login = req.body.login.trim()
    const password = req.body.password.trim()
    const errors = {}
    let user = null
    let valid = null

    valid = checkValid("auth", "password", password)
    if (valid !== true) {
      errors.password = valid
    }

    valid = checkValid("auth", "login", login)
    if (valid !== true) {
      errors.login = valid
    }
    
    if (!Object.keys(errors).length) {
      user = await User.findOne({ login })
      if (!user) {
        errors.login = "Такого пользователя не существует"
      } else if (user.password !== password) {
        errors.password = "Пароль неверный"
      }
    }

    if (Object.keys(errors).length) {
      res.render("login", {
        page,
        errors,
        fields: { login, password },
        layout: "main-no-sidebar",
      })
    } else {
      req.session.userId = user._id
      res.redirect("/profile")
    }
  })
}