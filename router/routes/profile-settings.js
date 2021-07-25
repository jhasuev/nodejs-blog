module.exports = router => {
  router.get("/profile/settings", (req, res) => {
    res.render("profile-settings", { layout: "profile-no-sidebar" })
  })
}