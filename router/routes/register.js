const { checkValid } = require("../../helpers/")
const User = require("../../models/User")
const page = { title: "Регистрация", description: "Регистрация на сайте" }

module.exports = router => {
  router.get("/register", (req, res) => {
    res.render("register", {
      page,
      layout: "main-no-sidebar",
    })
  })

  router.post("/register", async (req, res) => {
    const name = req.body.name.trim()
    const login = req.body.login.trim()
    const password = req.body.password.trim()
    const passwordConfirm = req.body.passwordConfirm.trim()
    
    const errors = {}
    let valid = true

    valid = checkValid("auth", "name", name)
    if (valid !== true) {
      errors.name = valid
    }

    valid = checkValid("auth", "login", login)
    if (valid !== true) {
      errors.login = valid
    } else {
      const userWithSameLogin = await User.findOne({ login })
      if (userWithSameLogin) {
        errors.login = 'Логин занят'
      }
    }

    valid = checkValid("auth", "password", password)
    if (valid !== true) {
      errors.password = valid
    }

    valid = checkValid("auth", "password", passwordConfirm)
    if (valid !== true) {
      errors.passwordConfirm = valid
    } else if (password != passwordConfirm) {
      errors.passwordConfirm = "Пароли должны совпадать"
    }

    if (!Object.keys(errors).length) {
      // ошибок нет, можно регистрировать
      const user = new User({ name, login, password })
      try {
        await user.save()
        req.session.userId = user._id
        return res.redirect("/profile")
      } catch (e) {
        console.log(e);
      }
    }

    res.render("register", {
      page,
      errors,
      fields: { name, login, password, passwordConfirm },
      layout: "main-no-sidebar",
    })
  })
}
