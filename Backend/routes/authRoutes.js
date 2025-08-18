const { signup, login, verifyEmail } = require("../Controllers/AuthController");
const { signupValidation, loginValidation, verifyToken } = require("../Middlewares/AuthValidation");
const { requestReset, resetPassword } = require("../Controllers/ResetPasswordControllers");

const router = require("express").Router();

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.get("/verify-email/:token", verifyEmail);

// 🔹 Reset password routes
router.post("/request-reset", requestReset);
router.post("/reset-password/:token", resetPassword);

router.get("/profile", verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        profile: req.user,
    });
});

module.exports = router;
