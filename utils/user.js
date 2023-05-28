const { check } = require("express-validator")
const validator = require("../middlewares/validatormiddelware")
const ApiError = require("./apiError")


exports.makeOrderValidation = [
    check("eviction_name").isLength({ min: 3 }).withMessage("Please Enter Your Eviction Name "),
    check("username").isLength({ min: 3 }).withMessage("Please Enter Your Username"),
    check("source_location").notEmpty().withMessage("Please Enter Your Source Location"),
    check("dis_location").notEmpty().withMessage("Please Enter Your Dis Location"),
    check("arrival_time").notEmpty().withMessage("Please Enter Your Arrival Time"),
    check("type_eviction").isLength({ min: 3 }).withMessage("Please Enter Your Eviction Type"),
    check("price").notEmpty().withMessage("Please Enter Your Price"),
    check("phone").optional().notEmpty().withMessage("Please Enter Vaild Phone Number"),
    check("eviction_size").isLength({ min: 3 }).withMessage("Please Enter Your Eviction Size"),
    validator
]

exports.makeDeliveryValidation = [
    check("username").isLength({ min: 3 }).withMessage("Please Enter Your Username"),
    check("source_location").notEmpty().withMessage("Please Enter Your Source Location"),
    check("dis_location").notEmpty().withMessage("Please Enter Your Dis Location"),
    check("phone").optional().notEmpty().withMessage("Please Enter Your Eviction Type"),
    check("eviction_size").isLength({ min: 3 }).withMessage("Please Enter Your Eviction Size"),
    validator
]

exports.payValidator = [
    check("amount").notEmpty({ ignore_whitespace: true }).isLength({ min: 1 }).withMessage("Please Enter Valid Amount"),
    check("password").notEmpty({ ignore_whitespace: true }).isLength({ min: 6 }).withMessage("Please Enter Valid Password"),
    validator
]



exports.confirmPaymentValidator = [
    check("payerId").notEmpty().isLength({ min: 12 }).withMessage("Please Enter Valid Payer Id"),
    check("paymentId").notEmpty().withMessage("Payment Id Should Be Not Empty").custom(val => {
        if (!val.startsWith("PAYID")) throw new ApiError("Please Enter Valid Payment Id",400)  
        return true
    }),
    check("amount").notEmpty().withMessage("Please Enter Amount"),
    validator
]