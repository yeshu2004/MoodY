const express = require('express')
const aiRoute = require('./routes/ai.route');

const app = express();

app.get('/',(req,res)=>{
    res.send("hey welcome!")
})

app.use('/ai',aiRoute)


module.exports = app