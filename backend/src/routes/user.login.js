const { router } = require("../app");
const bcrypt = require('bcryptjs')
const User = require("../schema/user.schema");

router.post("/login", async(req,res)=>{
    const {email,password} = req.body;

    let user = User.findOne({email})
    if(!user){
        return res.status(500).send("email is not registered!")
    }
    bcrypt.compare(password, user.password , function(err,result){
        if(result) {
            let token = jwt.sign({email: email,userid: user._id},`shhhhh`)
            res.cookie("token",token)
            // res.redirect("/home")
        }
        else res.redirect("/login")
    })
})