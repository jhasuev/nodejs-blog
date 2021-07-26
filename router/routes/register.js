const { checkValid } = require("../../helper")
const User = require("../../models/User")

module.exports = router => {
  router.get("/register", (req, res) => {
    res.render("register")
  })

  router.post("/register", async (req, res) => {
    const name = req.body.name.trim()
    const login = req.body.login.trim()
    const password = req.body.password.trim()
    const passwordConfirm = req.body.passwordConfirm.trim()
    
    const errors = {}
    let valid = true

    valid = checkValid("name", name)
    if (valid !== true) {
      errors.name = valid
    }

    valid = checkValid("login", login)
    if (valid !== true) {
      errors.login = valid
    } else {
      const userWithSameLogin = await User.findOne({ login })
      if (userWithSameLogin) {
        errors.login = 'Логин занят'
      }
    }

    valid = checkValid("password", password)
    if (valid !== true) {
      errors.password = valid
    }

    if (password != passwordConfirm) {
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
      errors,
      fields: { name, login, password, passwordConfirm },
    })
  })
}
