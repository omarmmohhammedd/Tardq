
// Error Format For Development Stage
const sendErrorForDev = (err, res) =>
    res.status(err.statusCode).json({
        status: err.status,
        err: err,
        message: err.message,
        stack : err.stack
        
    })

// Error Format For Development Stage
const sendErrorForProd = (err, res) => 
    res.status(err.statusCode).json({
        err: err.message,
        status:err.status
    })

// Errors Handling For JWT
const handleJwtInvalidSignature = () =>
    new ApiError("Invalid token, please login again..", 401);
const handleJwtExpired = () =>
    new ApiError("Expired token, please login again..", 401);

// Global Error Handler
module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error";
    if (process.env.NODE_ENV !== "production") sendErrorForDev(err, res)
    else {
        if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
        if (err.name === "TokenExpiredError") err = handleJwtExpired();
        sendErrorForProd(err, res);
    }
}