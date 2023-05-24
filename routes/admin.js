const router = require("express").Router()

const { addRule, activePayment } = require("../controller/admin")
const imgUploader = require("../middlewares/imgUploader")

router.post("/rule",imgUploader.single("img"),addRule)
router.put("/payment/:payment_id",activePayment)

module.exports = router