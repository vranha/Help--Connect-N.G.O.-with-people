const express = require("express");
const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const bodyParser = require("body-parser")
const socket = require("socket.io")

const cors = require("cors");
require("dotenv").config();


const app = express();
app.use(cors());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

const uri = process.env.URI;
mongoose
    .connect(uri, {
        dbName: "My_ong_tinder",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("DB Connection Successfull");
    })
    .catch((err) => {
        console.log(err.message);
    });

const PORT = 8000;

app.get("/", (req, res) => {
    res.json("Hello to my app");
});

// Sign up to the Database

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoutes);


const server = app.listen(PORT, () => console.log("Server running on PORT " + PORT));

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
})

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id)
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message)
            // socket.to(sendUserSocket).emit("notification", data)
            console.log(data)
        }
    });

});
