const mongoose = require("mongoose")

module.exports = mongoose.model("User", new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a username min Length 3"],
        min:3
    },
    home_location: {
        type: String,
        required: [true, "Please Enter Valid Lovation"]
    },
    phone: {
        type: String,
        required:[true,"Please Enter Valid Phone"]
    },
    email: {
        type: String,
        required:[true,"Please Enter Valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Valid Password with min Char 6"],
        min:6
    },
    role: {
        type: String,
        enum: ["admin", "client"],
        default:"client"
    },
    active: {
        type: Boolean,
        default: false
    }
}))