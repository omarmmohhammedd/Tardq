const express = require("express")
const app = express()
const cors = require("cors")
const path = require("path")
require("dotenv").config()
const PORT = process.env.PORT || 8080
const mongoose = require("mongoose")
const verifyToken = require("./middlewares/verifyToken")
const paypal = require("paypal-rest-sdk")
const server = require("http").createServer(app)
const io = require("socket.io")(server)

app.use(cors())
app.use(process.env.NODE_ENV !== "production" && require("morgan")("dev"))
app.use(express.static(path.join(__dirname, "images")));
app.use(express.json())
app.get("/", (req, res, next) => res.send("Main Page For Tardq Api Server"))
app.use("/auth", require("./routes/auth"))
app.use("/user", verifyToken, require("./routes/user"))
app.use("/admin", require("./routes/admin"))

let userSockets = new Map()
io.on("connection", async (socket) => {
    console.log('New client connected');
    const { id } = socket.handshake.query;
    userSockets.set(id, socket.id)
    const User = require("./model/User")
    await User.findByIdAndUpdate(id, { active: true })
    socket.on("newMessage", async (data) => {
        const { saveMessage } = require("./utils/Message")
        const { sender, receiver, message } = data
        const senderSocketId = userSockets.get(sender)
        const check = await saveMessage(sender, receiver, message)
        if (check) socket.emit("error", check.message)
        else {
            if (userSockets.get(receiver)) {
                const reciverSocketId = userSockets.get(receiver)
                io.to(senderSocketId).to(reciverSocketId).emit('receiveNewMessage', data)
            } else io.to(senderSocketId).emit('receiveNewMessage', data)
        }
    })
    socket.on('disconnect', async () => {
        userSockets.delete(id)
        await User.findByIdAndUpdate(id, { active: false })
        console.log("user disconnected")
    })
})

app.get("/success", (req, res, next) => {
    const paymentId = req.query.paymentId;
    const payerId = req.query.PayerID;
    const executePaymentData = {
        "payer_id": payerId,
    };
    paypal.payment.execute(paymentId, executePaymentData, async (error, payment) => {
        if (error) {
            console.error(error);
            res.status(500).send('Payment execution failed');
        } else {
            const paymentModel = require("./model/Payments")
            await paymentModel.create({
                user: "646b85e590b3957a08591435",
                payment_type: "paypal",
                amount: "1.00",
                At: new Date(new Date(payment.create_time).getTime() + 1 * 60 * 1000 * 180),
                payment_id: paymentId
            }).then(() => res.send('Payment successful'))

        }
    });

})
app.get("/cancel", (req, res) => res.send("cancled"))

app.use(require("./middlewares/globalError"))


app.use("*", (req, res) => res.status(404).send("Page Not Found"))
mongoose.set({ strictPopulate: false })
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then((con) => {
    server.listen(PORT, () => {
        console.log(`listen on port ${PORT} And Connect To DB ${con.connection.host}`)
    })
}).catch((err) => console.log(err))


module.exports = { io, userSockets }