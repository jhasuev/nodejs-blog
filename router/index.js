const { Router } = require("express")
const router = Router()

require("./routes/index")(router)

module.exports = router