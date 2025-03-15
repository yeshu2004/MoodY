const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schema/user.schema");

const router = express.Router();

// REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        // Generate JWT Token
        const token = jwt.sign({ email: email, userid: newUser._id }, process.env.JWT_SECRET || 'shhhhh', {
            expiresIn: "7d" // Token expires in 7 days
        });

        // Set token in cookie
        res.cookie("token", token, { httpOnly: true });

        res.status(201).json({ message: "User registered successfully!", token });

    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// MIDDLEWARE: Check if user is logged in
function isLoggedIn(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token) return res.status(401).json({ message: "You must be logged in" });

        const data = jwt.verify(token, process.env.JWT_SECRET || 'shhhhh');
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token", error: error.message });
    }
}

module.exports = isLoggedIn;
module.exports = router;
