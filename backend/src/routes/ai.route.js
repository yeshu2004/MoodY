const express = require('express')
const router = express.Router()
const generateContent = require('../services/ai.service');
const Mood = require('../schema/mood.schema');

router.get('/mood-review',async (req,res)=>{
    try {
        //fetch mood
        const { mood } = req.query; //req.body

        // if mood doesnt exists
        if(!mood){
            return req.status(400).send("please enter your mood")
        }

        // moodResponse 
        const moodResponse = await generateContent(mood)

        // const newMood = new Mood({
        //     user: req.user?.id || null,
        //     moodType: moodResponse.mood.toLowerCase(),
        //     moodNote: moodResponse.motivation_note,
        // })

        // await newMood.save();
        console.log(moodResponse)
        res.send(moodResponse)

    } catch (error) {
        console.error("Error saving mood:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports= router;