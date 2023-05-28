const router = require("express").Router()
const { addRule, activePayment } = require("../controller/admin")
const imgUploader = require("../middlewares/imgUploader")
const { check } = require("express-validator")
const validator = require("../middlewares/validatormiddelware")

// Add New Rule 
router.post("/rule", imgUploader.single("img"), [check("whatsapp").optional().isMobilePhone().withMessage("Enter Valid Phone Number"),validator],addRule)
// Activate Payment
router.put("/payment/:payment_id",activePayment)

module.exports = router