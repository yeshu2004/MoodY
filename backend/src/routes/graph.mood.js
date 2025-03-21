const express = require("express")
const isLoggedIn = require("../middlewares/auth.middleware")
const User = require("../schema/user.schema")
const router = express.Router()

router.get('/mood', isLoggedIn ,async (req,res)=>{
    try {
        const user = await User.findOne({email: req.user.email}).populate("mood")

        if (!user || !user.mood.length) {
            return res.status(404).json({ error: "No mood history found" });
        }

        // for graph plotting
        const moodHistory = user.mood.map((mood) => ({
            id: mood._id,
            moodType: mood.moodType,
            colour: mood.moodColour,
            createdAt: mood.createdAt.toISOString().split("T")[0],
        }));



        // mood analysis
        const moodCount = {}
        const totalMoods = user.mood.length;

        user.mood.forEach(mood => {
            moodCount[mood.moodType] = (moodCount[mood.moodType] || 0) + 1;
        })
        // Find the dominant mood(s)
        const maxCount = Math.max(...Object.values(moodCount));
        const dominantMoods = Object.keys(moodCount).filter(mood => moodCount[mood] === maxCount);

        // Calculate the percentage of the dominant mood
        const dominantPercentage = ((maxCount / totalMoods) * 100).toFixed(2);

        // Construct the analysis message
        let moodAnalysis = "";
        if (dominantMoods.length > 1) {
            moodAnalysis = `Your month was a mix of ${dominantMoods.join(" and ")} moods.`;
        } else {
            moodAnalysis = `Your dominant mood from last 30 days is ${dominantMoods[0]} with a frequency of ${dominantPercentage}%.`;
        }

        console.log(moodAnalysis);

        res.json(moodHistory)
        
    } catch (error) {
        console.error("Error fetching mood graph data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports= router