const router = require("express").Router()
const { makeOrder, getOrders, getDelivery, makeDelivery, get_rules, pay, makePayment, getAllMessages } = require("../controller/user")
const imgUploader = require("../middlewares/imgUploader.js")
const { makeOrderValidation, makeDeliveryValidation, payValidator, makePaymentValidator } = require("../utils/user.js")

router.post("/order", imgUploader.array("order_photo", 6), makeOrderValidation, makeOrder)
router.get("/order", getOrders)

router.post("/delivery", makeDeliveryValidation, makeDelivery)
router.get("/delivery", getDelivery)

router.get("/rules", get_rules)
router.post("/pay", payValidator,pay)
router.post("/payment", makePaymentValidator, makePayment)

// router.post("/message/:to", sendMessage)
router.get("/message", getAllMessages)

module.exports = router