const express = require('express')
const router = express.Router()
const generateContent = require('../services/ai.service');
const Mood = require('../schema/mood.schema');
const isLoggedIn = require('../middlewares/auth.middleware');
const User = require('../schema/user.schema');

router.post('/mood-review',isLoggedIn,async (req,res)=>{
    try {
        console.log(req.user);
        let user = await User.findOne({email: req.user.email})
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        //fetch mood
        const { mood } = req.body;
        if(!mood){
            return res.status(400).send("please enter your mood")
        }
        
        // moodResponse 
        const moodResponse = await generateContent(mood)
        if (!moodResponse) {
            return res.status(500).json({ error: "Error generating mood response" });
        }

        const newMood = new Mood({
            user: user._id,
            moodType: moodResponse.mood.toLowerCase(),
            moodNote: moodResponse.motivation_note,
            moodColour: moodResponse.colour
        })

        await newMood.save();

        user.mood.push(newMood._id);
        await user.save(); 

        console.log(newMood)
        res.send(moodResponse)

    } catch (error) {
        console.error("Error saving mood:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports= router;