const { check } = require("express-validator")
const validator = require("../middlewares/validatormiddelware")
const ApiError = require("./apiError")
// { eviction_name, username, source_location, dis_location, price, arrival_time, type_eviction, phone, eviction_size }
exports.makeOrderValidation = [
    check("eviction_name").isLength({ min: 3 }).withMessage("Please Enter Your Eviction Name "),
    check("username").isLength({ min: 3 }).withMessage("Please Enter Your Username"),
    check("source_location").notEmpty().withMessage("Please Enter Your Source Location"),
    check("dis_location").notEmpty().withMessage("Please Enter Your Dis Location"),
    check("arrival_time").notEmpty().withMessage("Please Enter Your Arrival Time"),
    check("type_eviction").isLength({ min: 3 }).withMessage("Please Enter Your Eviction Type"),
    check("price").notEmpty().withMessage("Please Enter Your Price"),
    check("phone").optional().isMobilePhone().withMessage("Please Enter Your Eviction Type"),
    check("eviction_size").isLength({ min: 3 }).withMessage("Please Enter Your Eviction Size"),
    validator
]

exports.makeDeliveryValidation = [
    check("username").isLength({ min: 3 }).withMessage("Please Enter Your Username"),
    check("source_location").notEmpty().withMessage("Please Enter Your Source Location"),
    check("dis_location").notEmpty().withMessage("Please Enter Your Dis Location"),
    check("price").notEmpty().withMessage("Please Enter Your Price"),
    check("phone").optional().isMobilePhone().withMessage("Please Enter Your Eviction Type"),
    check("eviction_size").isLength({ min: 3 }).withMessage("Please Enter Your Eviction Size"),
    validator
]

exports.payValidator = [
    check("amount").notEmpty({ ignore_whitespace: true }).isLength({ min: 1 }).withMessage("Please Enter Valid Amount"),
    check("password").notEmpty({ ignore_whitespace: true }).isLength({ min: 6 }).withMessage("Please Enter Valid Password"),
    validator
]

exports.makePaymentValidator = [
    check("payment_id").notEmpty({ ignore_whitespace: true }).isLength({ min: 1 }).withMessage("Please Enter Valid Payment ID"),
    check("amount").notEmpty({ ignore_whitespace: true }).isLength({ min: 1 }).withMessage("Please Enter Valid Amount"),
    check("At").notEmpty().withMessage("Please Enter Valid Date").custom(date => {
        let d = new Date(date)
        console.log(d)
        if (!d) throw new ApiError("Enter Valid Date", 400)
        return true
    }),
    check("payment_type").isIn(["paypal","visa"]).withMessage("Please Enter Valid Payment Type"),
    validator
]