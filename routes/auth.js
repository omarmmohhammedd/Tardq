const router = require("express").Router()

const { Login, Register } = require("../controller/auth")
const { LoginValidator, RegisterValidator } = require("../utils/auth")

router.post("/login", LoginValidator, Login)
router.post("/register", RegisterValidator, Register)

module.exports = router
