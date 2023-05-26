const router = require("express").Router()
const { check } = require("express-validator")
const validator = require("../middlewares/validatormiddelware.js")
const { Login, Register, getDelivery, getOrders, searchEviction } = require("../controller/auth")
const { LoginValidator, RegisterValidator } = require("../utils/auth")

// User Login
router.post("/login", LoginValidator, Login)
// New User Registration
router.post("/register", RegisterValidator, Register)
// Get All Deliveries
router.get("/delivery", getDelivery)
// Get All Orders
router.get("/order", getOrders)

router.get("/search", [check("search").notEmpty().withMessage("Please Add Search Input"), validator], searchEviction)

module.exports = router
