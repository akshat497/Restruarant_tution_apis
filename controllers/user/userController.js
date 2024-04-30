// const userController={
//     registeruser:async(req,res)=>{
//      res.status(200).json({message:"controller working"})
//     }
// }
// module.exports=userController
const User=require('../../modals/user')
const bcrypt=require( 'bcrypt');
const jwt=require("jsonwebtoken");
const handleResponse  = require('../services/handleResponse');
const userController={
    registerUser:async(req,res)=>{
        const { name, email, location, password } = req.body;
 console.log(req.body)
        // Check if required fields are missing
        if (!name || !email || !location || !password) {
            handleResponse(res,400,"Required fields are missing!")
         }
        
        try {
            // Create user
            const existingUser=await User.findOne({email});
            if(existingUser){
                return res.status(400).json({message:"User already exists!"})
            }
            const salt =await bcrypt.genSalt(10)
            const encryptedPassword=await bcrypt.hash(password,salt) 
            const encryptedLocation=await bcrypt.hash(location,salt) 
            const user = await User.create({ name, email, password:encryptedPassword, location:encryptedLocation });
            return res.status(201).json({ message: "User created successfully", user });
        } catch (error) {
            // Handle error
            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
        
    },
    login:async(req,res)=>{
        const {email,password}=req.body;
         const existingUser=await User.findOne({email});
         if(!existingUser){
            return handleResponse(res,404,"Invalid crediancials!!")
        
            // return res.status(404).json({message:"Invalid crediancials!"})
         }
         try {
            const passwordIsValid=await bcrypt.compare(password, existingUser.password);
            if(!passwordIsValid){
                return handleResponse(res,404,"Invalid crediancials!!")
            }
             const payload={
                id:existingUser._id
             }
             const authToken=jwt.sign(payload,process.env.JWT_SCRT)
            return handleResponse(res,200,"successfull",null,authToken)
            // return res.status(200).json({message:"successfull",token:authToken})
         } catch (error) {
            console.log(error);
            return res.status(500).json({message: 'Server Error!'})
         }


    },
    fetchUser:async(req,res)=>{
     try {
       
        return handleResponse(res,200,"successfull",null,req.user)
        
     } catch (error) {
         return handleResponse(res,500,"Server error",error,null)
     }

    }

}
module.exports=userController;