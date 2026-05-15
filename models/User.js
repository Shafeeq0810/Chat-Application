const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// Export Model
module.exports = mongoose.model("User", userSchema);