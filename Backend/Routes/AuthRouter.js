const { signup, login } = require("../Controllers/AuthController");
const { signupValidation, loginValidation, verifyToken } = require("../Middlewares/AuthValidation");

const router = require("express").Router();

router.post("/signup", signupValidation, signup)
router.post("/login", loginValidation, login)


// Example: protected route
router.get("/profile", verifyToken, (req, res) => {
    res.status(200).json({
        success: true,
        profile: req.user, 
    });
});


module.exports = router