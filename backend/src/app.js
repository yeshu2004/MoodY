const express = require('express')
const aiRoute = require('./routes/ai.route');
const registerRoute = require('./routes/user.register')
const loginRoute = require('./routes/user.login')
const moodHistory = require('./routes/graph.mood')

const dbConnection = require('./db/db');
const cookieParser = require('cookie-parser')
const app = express();

app.use(express.json()); // For JSON requests
app.use(cookieParser()); // To read cookies

dbConnection()

app.get('/',(req,res)=>{
    res.send("hey welcome!")
})

app.use('/ai',aiRoute)
app.use('/auth',registerRoute)
app.use('/auth',loginRoute)
app.use('/graph',moodHistory)




module.exports = app