module.exports = router => {
  router.get("/login", (req, res) => {
    res.render("login")
  })
}