module.exports = router => {
  router.get("/search", (req, res) => {
    res.render("search")
  })
}