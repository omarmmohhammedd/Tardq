const mongoose = require('mongoose')


module.exports = mongoose.model("Message", new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message: {
        type: String,
        required:[true,"Enter The Message"]
    },
    createdAt: {
        type: Date,
        required: true
    }
}))