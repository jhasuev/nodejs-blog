module.exports = router => {
  router.get("/profile", (req, res) => {
    res.render("profile", { layout: "profile" })
  })
}