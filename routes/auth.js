const router = require("express").Router()

const { Login, Register, getDelivery, getOrders } = require("../controller/auth")
const { LoginValidator, RegisterValidator } = require("../utils/auth")

// User Login
router.post("/login", LoginValidator, Login)
// New User Registration
router.post("/register", RegisterValidator, Register)
// Get All Deliveries
router.get("/delivery", getDelivery)
// Get All Orders
router.get("/order", getOrders)
module.exports = router
