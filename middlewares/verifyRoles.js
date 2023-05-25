const ApiError = require("../utils/apiError")
const jwt = require("jsonwebtoken")


module.exports = (...allowedRoles) => {
    return (req, res, next) => {
        // Extract Token From Headers 
        const token = req.headers.authorization && req.headers.authorization.split(" ")[1]
        if (!token) return next(new ApiError("Invalid authorization token", 401))
        // Verify Token 
        jwt.verify(token, process.env.TOKEN, (err, decoded) => {
            if (err) return next(new ApiError(err.message, 401))
            // Check User Roles
            if (!allowedRoles.includes(decoded.role)) return next(new ApiError("This User Doesn't Allow To Make Any Action Here", 401))
            next()
        })
    }
}