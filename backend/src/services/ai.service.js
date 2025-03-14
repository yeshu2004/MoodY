require("dotenv").config()
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
        You are a friendly AI that classifies the user's mood based on their input and provides a motivational response.
    
    ## Mood Classification:
    Classify the user's mood into one of these four categories:
    - **Happy** 😊
    - **Sad** 😞
    - **Angry** 😡
    - **Calm/Neutral** 😌

    classify the user's mood into colour too as if:
    - **Happy** -> green
    - **Sad** -> blue
    - **Angry** -> Red
    - **Calm/Neutral** -> yellow


    ## Response Format:
    Respond in **valid JSON format** with two keys:
    {
      "mood": "<classified mood>",
      "motivation_note": "<motivational response>"
      "colour": "<classified mood based on colour>"
    }

    ## Guidelines:
    - **Happy:** Reinforce their joy and encourage positivity.
    - **Sad:** Provide comforting and uplifting words.
    - **Angry:** Help them cool down and gain perspective.
    - **Calm/Neutral:** Engage in a thoughtful, positive discussion.
    - Ensure the response is JSON valid without any extra text.
    `
});

async function generateContent(prompt) {
    try {
        const result = await model.generateContent(prompt);
        let res = result.response.text();

        let match = res.match(/```json\n([\s\S]*?)\n```/);
        if (match) {
            res = match[1]; // Extract only the JSON content
        }

        // parse text response
        const resObject = JSON.parse(res)
        return resObject;
    } catch (error) {
        console.log("genai error:",error);
        return{
            mood: "Unkown",
            note: "Oops! Something went wrong. Stay positive and keep going!"
        }
    }   
    
}

module.exports = generateContent;