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
    const link = `${process.env.FRONTEND_URL}verify-email/${token}`;
    const mailOptions = {
        from: `Chai GPT <${process.env.EMAIL_USER}>`,
        to,
        subject: "Verify your email",
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
                <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #333333;">Welcome to Chai GPT! ☕</h2>
                    <p style="font-size: 16px; color: #555555;">
                        Thank you for signing up. To complete your registration, please verify your email address by clicking the button below:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${link}" target="_blank" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                            Verify Email
                        </a>
                    </div>
                    <p style="font-size: 14px; color: #888888;">
                        If the Clicking doesn’t work, copy and paste this URL into your browser:
                    </p>
                    <p style="word-break: break-all; font-size: 14px; color: #555555;">
                        <a href="${link}" target="_blank" style="color: #1a73e8;">${link}</a>
                    </p>
                    <hr style="margin: 40px 0; border: none; border-top: 1px solid #dddddd;" />
                    <p style="font-size: 12px; color: #999999; text-align: center;">
                        You’re receiving this email because you signed up on our platform i.e. igidrcmms.netlify.app <br />
                        If you did not sign up, you can safely ignore this email.
                    </p>
                </div>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};


module.exports = { sendVerificationEmail };