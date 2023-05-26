const express = require("express")
const app = express()
const cors = require("cors")
const path = require("path")
require("dotenv").config()
const PORT = process.env.PORT || 8080
const server = require("http").createServer(app)
const io = require("socket.io")(server,({cors:{origin:"*"}}))
const compression = require("compression")
const helmet = require("helmet")
const verifyToken = require("./middlewares/verifyToken")
const verifyRoles = require("./middlewares/verifyRoles")
const DB = require("./config/DB.config")

// Middlewares
app.use(cors())
app.use(express.json())
app.use(compression())
app.use(helmet())
app.use("/images",express.static(path.join(__dirname, "images")));
process.env.NODE_ENV !== "production" && app.use(require("morgan")("dev"))

// Routes
app.get("/", (req, res, next) => res.send("Main Page For Tardq Api Server"))
app.use("/auth", require("./routes/auth"))
app.use("/user", verifyToken, require("./routes/user"))
app.use("/admin", verifyRoles("admin"),require("./routes/admin"))
app.use("*", (req, res) => res.status(404).send("Page Not Found"))

// implementation Of Socket Server
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
        console.log(id)
        await User.findByIdAndUpdate(id, { active: false })
        console.log("user disconnected")
    })
})

// Errro Handler Middleware
app.use(require("./middlewares/globalError"))

// Connecting To Database And Start Server
DB().then((con) => {
    server.listen(PORT, () => {
        console.log(`listen on port ${PORT} And Connect To DB ${con.connection.host}`)
    })
}).catch((err) => console.log(err))

