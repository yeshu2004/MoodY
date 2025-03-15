const express = require('express')
const aiRoute = require('./routes/ai.route');
const dbConnection = require('./db/db');

const app = express();
dbConnection()

app.get('/',(req,res)=>{
    res.send("hey welcome!")
})

app.use('/ai',aiRoute)

app.get('/register',)


module.exports = app