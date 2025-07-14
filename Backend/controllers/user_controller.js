// controllers/user_controller.js
const User = require('../models/user_model');
const { hashPassword } = require('../utils/authentication'); // adjust path as needed

async function handleUserSignUp(req, res) {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await hashPassword(password);

        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.render("Home");
    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).send("Error creating user");
    }
}

module.exports = {
    handleUserSignUp,
};
