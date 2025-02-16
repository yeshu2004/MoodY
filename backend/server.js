const app = require('./src/app')
require("dotenv").config()

const PORT = process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`server is running on PORT:${PORT}`)
})