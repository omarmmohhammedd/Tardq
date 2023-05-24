const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const ApiError = require("../utils/apiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




exports.Login = asyncHandler(async (req, res, next) => {
    const { phone, password } = req.body
    await User.findOne({ phone }).then(async user => {
        if (!user) return next(new ApiError("User Not Found", 404))
        const match = await bcrypt.compare(password, user.password)
        if (!match) return next(new ApiError("Password Not Match", 400))
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.TOKEN, { expiresIn: "30d" })
        res.json({user,token})
    })
})

exports.Register = asyncHandler(async (req, res, next) => {
    const { username, phone, email, home_location, password } = req.body
    await User.findOne({ phone }).then(async user => {
        if (user) return next(new ApiError("Phone is Exists", 400))
        await User.create({
            phone,
            home_location,
            email,
            username,
            password:await bcrypt.hash(password,10)
        }).then((user)=>{
            delete user._doc.password && delete user.__v
            res.status(201).json({user})
        })
    })
})
