const mongoose = require('mongoose');

module.exports = mongoose.model("Rules", new mongoose.Schema({
    type: {
        type: String,
        enum: ['uses', 'privacy', "main_img", "main_logo", "payment","commission"]
    },
    textBody: String,
    main_img: String,
    main_logo: String,
    commission: Number,
    payment_type: {
        type: String,
        enum: ['visa', 'master_card', 'paypal'],
    },
    clientId: String,
    clientSecert: String,
    mode: String,
    active: Boolean
}))