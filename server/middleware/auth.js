import User from "../Models/User.js";
import jwt from "jsonwebtoken";

export const protectRoute = async(req, res, next)=>{
    try{
        // const authHeader = req.headers.authorization;
        
        // // 2. Check if the header exists and starts with 'Bearer '
        // if (!authHeader || !authHeader.startsWith("Bearer ")) {
        //     return res.status(401).json({ success: false, message: "JWT must be provided" });
        // }

        // // 3. Extract the actual token (skip 'Bearer ')
        // const token = authHeader.split(" ")[1];

        const token = req.headers.token;

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.json({success:false, message:"User not found"});

        req.user = user;
        next();
    }catch(error){
        console.log(error.message);
        res.json({success:false, message: error.message})
    }
}

export const checkAuth = (req,res)=>{
    res.json({success:true, user: req.user});
}