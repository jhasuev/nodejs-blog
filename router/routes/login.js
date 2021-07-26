const User = require("../../models/User")
const { checkValid } = require("../../helper")

module.exports = router => {
  router.get("/login", (req, res) => {
    res.render("login")
  })

  router.post("/login", async (req, res) => {
    const login = req.body.login.trim()
    const password = req.body.password.trim()
    const errors = {}
    let user = null
    let valid = null

    valid = checkValid("password", password)
    if (valid !== true) {
      errors.password = valid
    }

    valid = checkValid("login", login)
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
      res.render("login", { errors, fields: { login, password } })
    } else {
      // TODO: сохранить _id в куки/сессии
      res.redirect("/profile")
    }
  })
}