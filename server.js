const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const User = require("./models/User");

const app = express();

const server = http.createServer(app);

const io = new Server(server);



// =========================
// MIDDLEWARE
// =========================

app.use(express.json());

app.use(express.static("public"));



// =========================
// MONGODB CONNECTION
// =========================

mongoose.connect(
  "mongodb://shafeeq0810_db_user:Shafeeq2003@ac-fhlew8n-shard-00-00.uiz8w2y.mongodb.net:27017,ac-fhlew8n-shard-00-01.uiz8w2y.mongodb.net:27017,ac-fhlew8n-shard-00-02.uiz8w2y.mongodb.net:27017/?ssl=true&replicaSet=atlas-x3xoc7-shard-0&authSource=admin&appName=Cluster0"
)
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));



// =========================
// REGISTER ROUTE
// =========================

app.post("/register", async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        // Encrypt password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({

            username,

            email,

            password: hashedPassword
        });

        // Save user in MongoDB
        await user.save();

        res.json({
            message:
            "User registered successfully"
        });

    } catch (error) {

        console.log(error);

        res.json({
            message:
            "Registration failed"
        });
    }
});



// =========================
// SOCKET.IO CHAT
// =========================

io.on("connection", (socket) => {

    console.log("A user connected");

    socket.on("chat message", (msg) => {

        io.emit("chat message", msg);

    });

    socket.on("disconnect", () => {

        console.log("User disconnected");

    });
});



// =========================
// START SERVER
// =========================

server.listen(3000, () => {

    console.log("Server running on port 3000");

});
// =========================
// LOGIN ROUTE
// =========================

app.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        // Find user by email
        const user =
        await User.findOne({ email });

        // User not found
        if (!user) {

            return res.json({
                message:
                "User not found"
            });
        }

        // Compare password
        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        // Wrong password
        if (!isMatch) {

            return res.json({
                message:
                "Incorrect password"
            });
        }

        // Login success
        res.json({
            message:
            "Login successful"
        });

    } catch (error) {

        console.log(error);

        res.json({
            message:
            "Login failed"
        });
    }
});