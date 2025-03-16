const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../schema/user.schema");

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login Attempt for:", email);

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "Email is not registered!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }

        let token = jwt.sign({ email: email, userid: user._id }, process.env.JWT_SECRET || "shhhhh", {
            expiresIn: "1h", // Token expires in 1 hour
        });

        console.log("Generated Token:", token);

        res.cookie("token", token, { httpOnly: true, secure: false });
        return res.status(200).json({ message: "User logged in", token });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
