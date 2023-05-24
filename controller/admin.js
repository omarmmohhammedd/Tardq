const asyncHandler = require('express-async-handler');
const paypal = require('paypal-rest-sdk');
const Eviction = require("../model/Eviction")
const Delivery = require("../model/Delivery")
const Rules = require("../model/Rules")
const axios = require("axios");
const ApiError = require('../utils/apiError');
exports.getAllEvictions = asyncHandler(async (req, res, next) => {
    await Eviction.find({}).then(evictions => res.json({ evictions }))
})

exports.getAllDelivery = asyncHandler(async (req, res, next) => {
    await Delivery.find({}).then(deliveries => res.json({ deliveries }))
})

exports.addRule = asyncHandler(async (req, res, next) => {
    const { type } = req.query
    if (type === "uses" || type === "privacy") {
        const { textBody } = req.body
        if (!textBody.length) return next(new ApiError("Please Add a textBody", 400))
        await Rules.findOne({ type }).then(async (rule) => {
            if (rule) await Rules.findOneAndUpdate({ type }, { textBody }).then((uses) => res.json(uses))
            else await Rules.create({ textBody, type }).then((uses) => res.json(uses))
        })
    }
    else if (type === 'main_img') {
        const main_img = req.file && req.file.path
        if (!main_img) return next(new ApiError("Please Add a main_img", 400))
        await Rules.findOne({ type }).then(async (rule) => {
            if (rule) await Rules.findOneAndUpdate({ type }, { main_img }).then((main_img) => res.json(main_img))
            else await Rules.create({ main_img, type }).then((main_img) => res.json(main_img))
        })
    }
    else if (type === 'main_logo') {
        const main_logo = req.file && req.file.path
        if (!main_logo) return next(new ApiError("Please Add a main_logo", 400))
        await Rules.findOne({ type }).then(async (rule) => {
            if (rule) await Rules.findOneAndUpdate({ type }, { main_logo }).then((main_img) => res.json(main_img))
            else await Rules.create({ main_logo, type }).then((main_img) => res.json(main_img))
        })
    } else if (type === 'commission') {
        const { commission } = req.body
        if (!commission || commission < 0) return next(new ApiError("Enter Valid commission", 400))
        await Rules.findOne({ type }).then(async (rule) => {
            if (rule) await Rules.findOneAndUpdate({ type }, { commission }).then((commission) => res.json(commission))
            else await Rules.create({ commission, type }).then((commission) => res.json(commission))
        })
    } else if (type === "payment") {
        const { payment_type } = req.body
        if (payment_type === "paypal") {
            const { clientId, clientSecert, mode } = req.body
            await axios.post(`${mode === "sandbox" ? "https://api.sandbox.paypal.com/v1/oauth2/token" : "https://api.paypal.com/v1/oauth2/token"}`, null, {
                params: {
                    grant_type: 'client_credentials',
                },
                auth: {
                    username: clientId,
                    password: clientSecert,
                },
            }).then(async response => {
                if (response.status === 200) {
                    await Rules.findOne({ type, payment_type, mode }).then(async exists => {
                        if (exists) await Rules.findOneAndUpdate({ type, payment_type, mode }, { clientId, clientSecert, mode })
                            .then(async payment => res.status(201).json({ payment }))
                        else await Rules.create({ type, payment_type, clientId, clientSecert, mode, active: false })
                            .then(async payment => res.status(201).json({ payment }))
                    })
                }
            }).catch(err => {
                console.log(err.message)
                return next(new ApiError(err.message, 401))
            })
        }
    }
}
)

exports.activePayment = asyncHandler(async (req, res, next) => {
    const { payment_id } = req.params
    await Rules.findById(payment_id).then(async payment => {
        if (!payment_id) return next(new ApiError("Payment Not Found", 404))
        if (payment.mode === "sandbox") {
            await Rules.updateMany({ mode: "live" }, { active: "false" })
            await Rules.findByIdAndUpdate(payment_id, { active: true }).then(() => res.sendStatus(200))
        } else {
            await Rules.updateMany({ mode: "sandbox" }, { active: "false" })
            await Rules.findByIdAndUpdate(payment_id, { active: true }).then(() => res.sendStatus(200))
        }

    })
})



