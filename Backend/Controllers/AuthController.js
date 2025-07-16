const UserModel = require("../models/user_model");
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Input validation (optional but recommended)
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists, please login", success: false });
        }

        // Hash the password before creating user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: "Signup successful", success: true });

    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

module.exports = {
    signup
};
