import jwt, { decode } from "jsonwebtoken"
import User from "../models/user.model.js"

export const protectRoute = async (req, res, next)=>{
    try {
        const token = req.cookies.UserToken;
        if(!token){
            return res.status(400).json({Error: "Unauthorized - No token provided"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded){
            return res.status(400).json({Error: "Unauthorized - Invalid token"})
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({Error: "User doesn't exists."})
        }

        req.user = user;
        next()
    } catch (error) {
        console.error("Error in protectRoute", error.message)
        res.status(500).json({Error: "internal server error."})
    }
}