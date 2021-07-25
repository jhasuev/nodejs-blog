module.exports = router => {
  router.get("/profile/edit", (req, res) => {
    res.render("profile-edit-post", { layout: "profile-no-sidebar" })
  })
}