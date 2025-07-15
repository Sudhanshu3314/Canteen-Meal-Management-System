// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensures email is unique
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8 
    }
}, {
    timestamps: true // adds createdAt and updatedAt fields automatically
});

const User = mongoose.model('User', userSchema);

module.exports = User;
