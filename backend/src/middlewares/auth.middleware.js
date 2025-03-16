const jwt = require('jsonwebtoken')

function isLoggedIn(req, res, next) {
    try {
        // console.log("Cookies:", req.cookies); // 

        const token = req.cookies?.token;
        console.log("Extracted Token:", token);

        if (!token) {
            return res.status(401).json({ message: "You must be logged in" });
        }

        const data = jwt.verify(token, process.env.JWT_SECRET || 'shhhhh');
        // console.log("Decoded Token Data:", data);

        req.user = data; 
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ message: "Invalid Token", error: error.message });
    }
}

module.exports = isLoggedIn;