const jwt = require('jsonwebtoken');
const ApiError = require("../utils/apiError")

module.exports = (req, res, next) => {
    // Extract Token From Headers 
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]
    if (!token) return next(new ApiError("Invalid authorization ", 401))
    // Verify Token 
    jwt.verify(token, process.env.TOKEN, (err, decoded) => { 
        if (err) return next(new ApiError(err.message, 401))
        req.user = decoded
        next()
    })
}