const { Router } = require("express")
const router = Router()

require("./routes/index")(router)
require("./routes/post")(router)

module.exports = router