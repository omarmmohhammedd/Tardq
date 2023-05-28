const { check } = require("express-validator")
const validator = require("../middlewares/validatormiddelware")


exports.LoginValidator = [
    check("phone").isMobilePhone().withMessage("Please Enter Valid Phone Number"),
    check("password").isLength({ min: 6 }).withMessage("Please Enter Valid Password With Minimum Length 6 "),
    validator
]

exports.RegisterValidator = [
    check("username").isLength({min:3}).withMessage("Please Enter Valid Username With Minimum Length 3"),
    check("phone").notEmpty().withMessage("Please Enter Valid Phone Number"),
    check("email").isEmail().withMessage("Please Enter Valid Email"),
    check("home_location").notEmpty().withMessage("Please Enter Valid Home Location"),
    check("password").isLength({ min: 6 }).withMessage("Please Enter Valid Password With Minimum Length 6 "),
    validator
]

