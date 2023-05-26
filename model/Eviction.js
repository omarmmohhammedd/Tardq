const mongoose = require("mongoose")

module.exports = mongoose.model("Eviction", new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    eviction_name: {
        type: String,
        required: [true, "Please enter a name for this eviction"],
        min:3
    },
    username: {
        type: String,
        required: [true, "Please enter a name for this eviction"],
        min: 3 
    },
    source_location: {
        type: String,
        required: [true, "Please enter a source location for this eviction"],
        min:3
    },
    dis_location: {
        type: String,
        required: [true, "Please enter a dis location for this eviction"],
        min: 3
    },
    price: {
        type: Number,
        required: [true, "Please enter a price for this eviction"],
        min:1
    },
    arrival_time: {
        type: String,
        required: [true, "Please enter a arrival time for this eviction"]
    },
    type_eviction: {
        type: String,
        required: [true, "Please enter a type of  eviction for this eviction"]
    },
    phone: String,
    eviction_size: {
        type: String,
        required:[true, "Please enter a size for this eviction"]
    },
    eviction_imgs: Array,
    phone: {
        type: String,
        required: [true, "Please enter a phone number"]
    }
},{timestamps: true}))