const asyncHandler = require("express-async-handler")
const paypal = require("paypal-rest-sdk")
const bcrypt = require("bcrypt")
const eviction = require("../model/Eviction")
const ApiError = require("../utils/apiError")
const Delivery = require("../model/Delivery")
const Rules = require("../model/Rules")
const User = require("../model/User")
const Message = require("../model/Messages")
const cloudinary = require("cloudinary").v2
const paymentModel = require("../model/Payments")

// Cloudinay Config Adapt

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Client Make Eviction
exports.makeOrder = asyncHandler(async (req, res, next) => {
    const { eviction_name, username, source_location, dis_location, price, arrival_time, type_eviction, phone, eviction_size } = req.body
    const { id } = req.user
    let imgs_path = []
    if (req.files) {
        imgs_path = await Promise.all(req.files.map(async img => {
            const uploadImg = await cloudinary.uploader.upload(img.path);
            return uploadImg.secure_url;
        }));
    }
    await eviction.create({ user: id, eviction_name, username, source_location, dis_location, price, arrival_time, type_eviction, phone: phone && phone, eviction_size, eviction_imgs: imgs_path })
        .then((order) => res.status(201).json({ order })).catch((error) => next(new ApiError(error.message, error.statusCode)))
})

// Client Make Delivery
exports.makeDelivery = asyncHandler(async (req, res, next) => {
    const { id } = req.user
    const { username, source_location, dis_location, price, eviction_size } = req.body
    const user = await User.findById(id)
    await Delivery.create({ user: id, username, source_location, dis_location, price, phone: user.phone, eviction_size })
        .then((delivery) => res.status(201).json({ delivery })).catch((error) => next(new ApiError(error.message, error.statusCode)))
})

// Get All Rules
exports.get_rules = asyncHandler(async (req, res, next) => {
    await Rules.find({}).then((rules) => res.json({ rules }))
})

// User Pay Commission
exports.pay = asyncHandler(async (req, res, next) => {
    const { amount, password } = req.body
    const { id } = req.user

    await User.findById(id).then(async user => {
        const match = await bcrypt.compare(password, user.password)
        if (!match) return next(new ApiError("Passwod Not Match", 400))
        await Rules.findOne({ payment_type: "paypal", active: true }).then((payment) => {
            if (!payment) return next(new ApiError("PayPal Payment Not Found", 404))
            paypal.configure({
                mode: payment.mode,
                client_id: payment.clientId,
                client_secret: payment.clientSecert
            })
            const paymentData = {
                intent: 'sale',
                payer: {
                    payment_method: 'paypal'
                },
                redirect_urls: {
                    return_url: process.env.REDIRECT_URL_SUCCESS,
                    cancel_url: process.env.REDIRECT_URL_CANCEL
                },
                transactions: [
                    {
                        amount: {
                            total: `${amount}`,
                            currency: 'USD'
                        },
                        description: 'Commission'
                    }
                ]
            }
            paypal.payment.create(paymentData, (err, payment) => {
                if (err) return next(new ApiError(err.message, err.statusCode))
                const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
                res.json({ approvalUrl })
            })
        })
    })
})

// User Confirm Payment
exports.confirmPayment = asyncHandler(async (req, res, next) => {
    const { paymentId, payerId, amount } = req.body
    const { id } = req.user
    await Rules.findOne({ payment_type: "paypal", active: true }).then((payment) => {
        paypal.configure({
            mode: payment.mode,
            client_id: payment.clientId,
            client_secret: payment.clientSecert
        })
        paypal.payment.execute(paymentId, { "payer_id": payerId, }, async (error, succesPayment) => {
            if (error) {
                console.log(error);
                res.status(500).send('Payment execution failed');
            } else await paymentModel.create({ user: id, payment_type: "paypal", amount, At: new Date(new Date(succesPayment.create_time).getTime() + 1 * 60 * 1000 * 180), payment_id: paymentId }).then(() => res.status(200).send('Payment successful'))

        });
    })

})

// Get All Messages To User
exports.getAllMessages = asyncHandler(async (req, res, next) => {
    const { id } = req.user
    const messages = await Message.find({ $or: [{ from: id }, { to: id }] }).populate({ path: "from to ", select: "username email phone active" })
    const allConversations = []
    let strictUsers = []
    messages.map((message) => {
        const dealedUser = message.from.equals(id) ? message.to : message.from
        if (!strictUsers.includes(dealedUser.phone)) {
            let userId = dealedUser.id
            const conversation = {
                [userId]: messages.filter(con => con.from.equals(dealedUser) || con.to.equals(dealedUser)).sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateA - dateB;
                })
            }
            strictUsers.push(dealedUser.phone)
            allConversations.push(conversation)
        }
    })
    res.json({ allConversations });
});

