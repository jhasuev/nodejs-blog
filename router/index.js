const { Router } = require("express")
const router = Router()

require("./routes/index")(router)
require("./routes/post")(router)
require("./routes/profile")(router)
require("./routes/profile-add-post")(router)
require("./routes/profile-edit-post")(router)
require("./routes/profile-settings")(router)

module.exports = router