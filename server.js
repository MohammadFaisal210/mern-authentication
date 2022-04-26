require('dotenv').config()
const express =require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const fileupload = require("express-fileupload")
const cookieParser = require("cookie-parser")

const path = require('path')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileupload({
    useTempFiles:true
}))

app.use("/user",require("./routes/userRouter"))
app.use('/api',require("./routes/upload"))

const URI = process.env.MONGODB_URL
mongoose.connect(URI,err=>{
    if(err) throw err;
    console.log("Connected to mongoDB");
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log("Server is running on port",port);
})