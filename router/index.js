const { Router } = require("express")
const router = Router()

// хз, но кажется так лучше, чем через middleware...
router.all(["/login", "/register"], (req, res, next) => {
  if (req.session.userId) res.redirect("/profile")
  else next()
})
router.all("/profile*", (req, res, next) => {
  if (!req.session.userId) res.redirect("/")
  else next()
})

require("./routes/index")(router)
require("./routes/post")(router)
require("./routes/login")(router)
require("./routes/register")(router)
require("./routes/search")(router)
require("./routes/profile")(router)
require("./routes/profile-add-post")(router)
require("./routes/profile-edit-post")(router)
require("./routes/profile-settings")(router)

module.exports = router