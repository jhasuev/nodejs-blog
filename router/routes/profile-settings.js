const User = require("../../models/User")
const { checkValid } = require("../../helpers/")

module.exports = router => {
  router.get("/profile/settings", async (req, res) => {
    const { name, login } = await User.findById(req.session.userId).lean()

    res.render("profile-settings", {
      fields: { name, login },
      layout: "profile-no-sidebar",
    })
  })

  router.post("/profile/settings", async (req, res) => {
    const user = await User.findById(req.session.userId).lean()
    const type = String(req.body.type).trim()
    const fields = {}
    fields.login = String(req.body.login).trim()
    fields.name = String(req.body.name).trim()

    const errors = {}
    let valid = null
    let updated = false

    switch (type) {
      case "info":
        valid = checkValid("auth", "login", fields.login)
        if (valid !== true) {
          errors.login = valid
        }

        valid = checkValid("auth", "name", fields.name)
        if (valid !== true) {
          errors.name = valid
        }

        if (!Object.keys(errors).length) {
          const update = {}
          if (fields.login !== user.login) update.login = fields.login
          if (fields.name !== user.name) update.name = fields.name

          if (Object.keys(update).length) {
            await User.findOneAndUpdate({ _id: user._id }, update)
            updated = true
          }
        }

        break;

      case "password":
        fields.login = user.login
        fields.name = user.name

        fields.oldPassword = String(req.body.oldPassword).trim()
        fields.password = String(req.body.password).trim()
        fields.passwordConfirm = String(req.body.passwordConfirm).trim()

        valid = checkValid("auth", "password", fields.oldPassword)
        if (valid !== true) {
          errors.oldPassword = valid
        } else if (fields.oldPassword !== user.password) {
          errors.oldPassword = "Неверный пароль"
        }

        valid = checkValid("auth", "password", fields.password)
        if (valid !== true) {
          errors.password = valid
        }

        valid = checkValid("auth", "password", fields.passwordConfirm)
        if (valid !== true) {
          errors.passwordConfirm = valid
        } else if (fields.passwordConfirm !== fields.password) {
          errors.passwordConfirm = "Пароли должны совпадать"
        }

        // если нет ошибок - пробуем менять
        if (!Object.keys(errors).length) {
          await User.findOneAndUpdate({ _id: user._id }, { password: fields.password })
          updated = true
        }

        break;
    }

    res.render("profile-settings", {
      errors,
      fields,
      updated,
      layout: "profile-no-sidebar",
    })
  })
}