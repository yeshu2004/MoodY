const jwt = require('jsonwebtoken')
const { router } = require("../app");
const User = require("../schema/user.schema");


router.post('/register',async (req,res) => {
    try {
        const {name, email,password} = req.body;
    
        const existingUser = User.findOne({email})
    
        if(existingUser){
            return res.status(400).json({ message: "User already exists!" });
        }
    
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const newUser = new User.create({
            name: name,
            email: email,
            password: hashedPassword
        })

        var token = jwt.sign({ email: email, userid: newUser._id }, 'shhhhh');
        res.cookie("token",token)
        // res.redirect("/login")
        res.status(200).send("User registered successfully!")

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

function isLoggedIn(req, res, next) {
    const token = req.cookies?.token;

    if (!token) return res.status(401).send("You must be logged in");

    const data = jwt.verify(token, `shhhhh`);
    req.user = data;
    next();
}

module.exports = isLoggedIn