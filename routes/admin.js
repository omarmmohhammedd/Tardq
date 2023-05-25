const router = require("express").Router()

const { addRule, activePayment } = require("../controller/admin")
const imgUploader = require("../middlewares/imgUploader")

// Add New Rule 
router.post("/rule", imgUploader.single("img"), addRule)
// Activate Payment
router.put("/payment/:payment_id",activePayment)

module.exports = router