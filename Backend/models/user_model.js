// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures email is unique
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/]
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
}, { timestamps: true });

const User = mongoose.model('user_model', userSchema);

module.exports = User;
