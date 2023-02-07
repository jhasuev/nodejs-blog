const multer = require('multer')
const moment = require('moment')
const { imageHash }= require('image-hash');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    console.log(1111111111);
    cb(null, "public/img/")
  },

  filename(req, file, cb) {
    console.log(222222222);
    const date = moment().format("DDMMYYYY-HHmmss")
    const randNumber = String(Math.random()).split(".").pop()
    const ext = file.originalname.split(".").pop()

    // TODO continue ...
    imageHash(file, 16, true, (error, data) => {
      console.log(3333333333);
      console.log('file', file);
      console.log(data);
      if (error) throw error;
      // 0773063f063f36070e070a070f378e7f1f000fff0fff020103f00ffb0f810ff0
    });

    
    cb(null, `${date}-${randNumber}-${ext}`)
  },
})

module.exports = multer({ storage })
