const mongoose=require("mongoose")
const userSchema=new  mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
     
        default:null
    },
    location:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})  
const User= mongoose.model("user",userSchema);

module.exports= User