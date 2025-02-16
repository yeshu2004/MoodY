const express = require('express')
const router = express.Router()
const generateContent = require('../services/ai.service')

router.get('/mood-review',async (req,res)=>{
    try {
        //fetch mood
        const { mood } = req.query;
        // if mood doesnt exists
        if(!mood){
            return req.status(400).send("please enter your mood")
        }
        // moodResponse 
        const moodResponse = await generateContent(mood)
        console.log(moodResponse)
        res.send(moodResponse)

    } catch (error) {
       return res.status(400).send(error)
    }
})

module.exports= router;