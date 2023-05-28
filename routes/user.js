const router = require("express").Router()
const { makeOrder,  makeDelivery, pay, getAllMessages, confirmPayment } = require("../controller/user")
const imgUploader = require("../middlewares/imgUploader.js")
const { makeOrderValidation, makeDeliveryValidation, payValidator, confirmPaymentValidator } = require("../utils/user.js")




//// Make Order
router.post("/order", imgUploader.array("order_photo", 6), makeOrderValidation, makeOrder)

//// Make Delivery
router.post("/delivery", makeDeliveryValidation, makeDelivery)

// Pay With Paypal
router.post("/pay", payValidator, pay)

// Confirm Payment
router.post("/confirmPayment", confirmPaymentValidator, confirmPayment)

// All Messages
router.get("/message", getAllMessages)


module.exports = router