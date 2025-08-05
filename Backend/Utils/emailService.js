const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (to, token) => {
    const link = `http://localhost:1234/verify-email/${token}`;
    const mailOptions = {
        from: `Chai GPT <${process.env.EMAIL_USER}>`,
        to,
        subject: "Verify your email",
        html: `<p>Click the link below to verify your email:</p><a href="${link}">${link}</a>`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };