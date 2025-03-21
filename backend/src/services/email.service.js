const nodemailer = require("nodemailer");
const { render } = require("@react-email/render");
const WeeklySummaryEmail = require("../emails/WeeklySummaryEmail.js").default;
const User = require("../schema/user.schema");
const cron = require("node-cron");

// Configure Email Transport
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to Send Weekly Summary
async function sendWeeklySummary() {
    const users = await User.find().populate("mood");

    for (let user of users) {
        if (user.mood.length === 0) continue; // Skip if no moods logged

        // Count mood occurrences
        let moodCount = {};
        user.mood.forEach(mood => {
            moodCount[mood.moodType] = (moodCount[mood.moodType] || 0) + 1;
        });

        // Get most common mood
        const mostCommonMood = Object.keys(moodCount).reduce((a, b) => moodCount[a] > moodCount[b] ? a : b);

        const streak = calculateMoodStreak(user.mood);
        const quote = getMotivationalQuote(mostCommonMood);
        const emailHtml = render(WeeklySummaryEmail({ user, mostCommonMood, streak, quote }));

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your Weekly Mood Summary 😊",
            html: emailHtml
        });

        console.log(`Weekly email sent to ${user.email}`);
    }
}

// Schedule to run every Sunday at 9 AM
cron.schedule("0 9 * * 0", sendWeeklySummary);

// Utility: Calculate Mood Streak
function calculateMoodStreak(moods) {
    let streak = 1, maxStreak = 1;
    moods.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Sort by date

    for (let i = 1; i < moods.length; i++) {
        let prevDate = new Date(moods[i - 1].createdAt);
        let currDate = new Date(moods[i].createdAt);
        let diff = (currDate - prevDate) / (1000 * 60 * 60 * 24); // Convert ms to days

        if (diff === 1) streak++;
        else streak = 1;

        maxStreak = Math.max(maxStreak, streak);
    }
    return maxStreak;
}

// Utility: Get Motivational Quote Based on Mood
function getMotivationalQuote(mood) {
    const quotes = {
        happy: "Happiness is not something ready made. It comes from your own actions. 😊",
        sad: "Every day may not be good, but there's something good in every day. 🌈",
        angry: "For every minute you remain angry, you give up sixty seconds of peace of mind. 🧘",
        neutral: "Peace begins with a smile. ☺️",
    };
    return quotes[mood] || "Stay positive and keep moving forward!";
}

module.exports = sendWeeklySummary;
