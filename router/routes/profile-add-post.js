module.exports = router => {
  router.get("/profile/add", (req, res) => {
    res.render("profile-add-post", { layout: "profile-no-sidebar" })
  })
}