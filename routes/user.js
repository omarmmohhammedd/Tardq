const router = require("express").Router()
const { makeOrder, getOrders, getDelivery, makeDelivery, get_rules, pay, getAllMessages, confirmPayment } = require("../controller/user")
const imgUploader = require("../middlewares/imgUploader.js")
const { makeOrderValidation, makeDeliveryValidation, payValidator, confirmPaymentValidator } = require("../utils/user.js")


// Orders Routes
// Get All Orders
router.get("/order", getOrders)
//// Make Order
router.post("/order", imgUploader.array("order_photo", 6), makeOrderValidation, makeOrder)

// Delivery Routes
//// Make Delivery
router.post("/delivery", makeDeliveryValidation, makeDelivery)
// Get All Deliveries
router.get("/delivery", getDelivery)

// Get All Rules
router.get("/rules", get_rules)

// Pay With Paypal
router.post("/pay", payValidator, pay)
// Confirm Payment
router.post("/confirmPayment", confirmPaymentValidator, confirmPayment)

// All Messages
router.get("/message", getAllMessages)

module.exports = router