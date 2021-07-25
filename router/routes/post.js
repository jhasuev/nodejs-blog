module.exports = router => {
  router.get("/post", (req, res) => {
    res.render("post")
  })
}