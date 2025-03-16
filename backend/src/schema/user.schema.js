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

module.exports = mongoose.model("User", userSchema)