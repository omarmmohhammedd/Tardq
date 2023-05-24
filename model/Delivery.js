const mongoose = require("mongoose")

module.exports = mongoose.model("Delivery",new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: {
        type: String,
        required: [true, "Please enter a name for this eviction"],
        min: 3
    },
    source_location: {
        type: String,
        required: [true, "Please enter a source location for this eviction"],
        min: 3
    },
    dis_location: {
        type: String,
        required: [true, "Please enter a dis location for this eviction"],
        min: 3
    },
    price: {
        type: Number,
        required: [true, "Please enter a price for this eviction"],
        min: 10
    },
    eviction_size: {
        type: String,
        required: [true, "Please enter a size for this eviction"]
    },
}))