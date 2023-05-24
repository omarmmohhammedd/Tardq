const mongoose = require('mongoose');
module.exports = mongoose.model("Payment", new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    amount: {
        type: Number,
        required: [true, "Please Add Amount Of Payment"]
    },
    payment_id: {
        type: String,
        required: [true, "Please Add Id Of Payment"]
    },
    At: {
        type: Date,
        required: [true,"Please Add Date Of Payment"]
    },
    payment_type: {
        type: String,
        required: [true, "Please Add Type Of Payment"]
    }
}))