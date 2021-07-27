const multer = require('multer')
const moment = require('moment')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "public/img/")
  },

  filename(req, file, cb) {
    const date = moment().format("DDMMYYYY-HHmmss")
    const randNumber = String(Math.random()).split(".").pop()
    
    cb(null, `${date}-${randNumber}-${file.originalname}`)
  },
})

module.exports = multer({ storage })
