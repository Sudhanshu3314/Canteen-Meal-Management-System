const Joi = require("joi")
const jwt = require("jsonwebtoken");

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(100).required()
    })

    const { error } = schema.validate(req.body)

    if (error) {
        return res.status(400).json({ message: "Bad Request", error })
    }
    next()
}
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(100).required()
    })

    const { error } = schema.validate(req.body)

    if (error) {
        return res.status(400).json({ message: "Bad Request", error })
    }
    next()
}

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided", success: false });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // You now have access to user data in the next middleware
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token", success: false });
    }
};

module.exports = {
    signupValidation, loginValidation, verifyToken
}