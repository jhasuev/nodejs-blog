module.exports = router => {
  router.get("/register", (req, res) => {
    res.render("register")
  })
}
