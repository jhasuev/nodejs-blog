const path = require("path")
const express = require("express")
const mongoose = require("mongoose")
const handlebars = require("express-handlebars")
const router = require("./router/")
const config = require("./config")
const app = express()
app.use(require("body-parser").urlencoded({ extended: true }))
app.use(router)
app.use(express.static(path.join(__dirname, "public")))

const hbs = handlebars({
  defaultLayout: "main",
  extname: "hbs",
})
app.engine("hbs", hbs)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")

async function start() {
  try {
    await mongoose.connect("mongodb://localhost/blog", {
      useNewUrlParser: true,
      useFindAndModify: false,
    })

    app.listen(config.PORT, () => {
      console.log(`Server started listening on ${config.PORT} port...`);
    })
  } catch (e) {
    console.log(e);
  }
}

start()