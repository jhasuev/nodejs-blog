const path = require("path")
const express = require("express")
const handlebars = require("express-handlebars")
const router = require("./router/")
const config = require("./config")
const app = express()
app.use(router)
app.use(express.static(path.join(__dirname, "public")))

const hbs = handlebars({
  defaultLayout: "main",
  extname: "hbs",
})
app.engine("hbs", hbs)
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")


app.listen(config.PORT, () => {
  console.log(`Server started listening on ${config.PORT} port...`);
})