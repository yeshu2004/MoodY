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

        const moodHistory = user.mood.map((mood) => ({
            id: mood._id,
            moodType: mood.moodType,
            colour: mood.moodColour,
            createdAt: mood.createdAt.toISOString().split("T")[0],
        }));

        res.json(moodHistory)
        
    } catch (error) {
        console.error("Error fetching mood graph data:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports= router