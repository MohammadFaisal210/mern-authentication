const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name!"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Please enter your email address"],
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Please enter your password"]
    },
    role:{
        type:Number,
        default:0
    },
    avatar:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOIw4i6nMOAcPikeIiDjYw7oedVyJaiqYSqPFvpFJ1t6G_I2_T1rzWLjtv4tBp8sU0A0I&usqp=CAU"
    }
},{
    timestamps:true
})

module.exports = mongoose.model("Users",userSchema)