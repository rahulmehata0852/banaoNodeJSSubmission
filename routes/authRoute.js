
const { registerUser, LogInUser, logOut, forgotPassword, verifyoTPAndChangePassword } = require("../contoler/authController")

const router = require("express").Router()


router
    .post("/register", registerUser)
    .post("/login", LogInUser)
    .post("/logout", logOut)
    .post("/forgonPassword", forgotPassword)
    .post("/changePassword", verifyoTPAndChangePassword)


module.exports = router

