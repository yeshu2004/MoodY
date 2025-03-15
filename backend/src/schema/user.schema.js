const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email:{
        unique: true,
        type: String,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true
    },
    mood: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mood"
        }
    ]
},{timestamps: true})


// userSchema.pre('save', async (next) => {
//     if(!this.isModified("password")){
//         return next
//     }
//     try {
//         const saltRounds = 10;
//         const salt = await bcrypt.genSalt(saltRounds)
//         this.password = await bcrypt.hash(this.password, salt)
//     } catch (error) {
        
//     }
// })

module.exports = mongoose.model("User", userSchema)