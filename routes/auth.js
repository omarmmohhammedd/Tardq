const router = require("express").Router()

const { Login, Register } = require("../controller/auth")
const { LoginValidator, RegisterValidator } = require("../utils/auth")

// User Login
router.post("/login", LoginValidator, Login)
// New User Registration
router.post("/register", RegisterValidator, Register)

module.exports = router
