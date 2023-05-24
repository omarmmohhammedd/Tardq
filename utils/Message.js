const Message = require("../model/Messages")
const ApiError = require("./apiError")
const User = require("../model/User")


exports.saveMessage = async (sender,receiver,message) => {
    if (!sender || !receiver || !message) return new ApiError("All Feilds Are Required", 400)
    try {
        await User.find({ _id: { $in: [sender, receiver] } }).then(async users => {
            if (users.length !== 2) return new ApiError("Users Not Found", 404)
            await Message.create({
                from: sender,
                to: receiver,
                message,
                createdAt: new Date(Date.now() + 1 * 60 * 1000 * 180)
            }).then(message => {
                if (message) return true
                else return new ApiError("Error Happend While Saving Message", 500)   
            })
        })
    } catch (e) { return new ApiError(e.message, 500) }
}