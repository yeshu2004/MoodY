const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    moodType: {
        type: String,
        lowercase: true,
        enum: ["happy", "sad", "angry", "calm/neutral"],
        required: true
    },
    moodNote: {  
        type: String,
        lowercase: true,
        trim: true 
    },
    moodColour:{
        type: String,
        lowercase: true,
        enum: ["green", "yellow", "blue", "red"],
        required: true,
    },
}, { timestamps: true }); 

module.exports = mongoose.model("Mood", moodSchema);
