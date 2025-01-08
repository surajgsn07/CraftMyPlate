import  ApiError  from "../utils/ApiError.js";
import  asyncHandler  from "../utils/asyncHandler.js";
import jwt, { decode } from "jsonwebtoken";
import  User  from "../models/User.model.js";

const verifyJwt = asyncHandler(async( req , res, next)=>{
    try {
        
        const token =  req.header("Authorization")?.replace("Bearer " , "") || req.body.token || req.body.headers?.Authorization?.replace("Bearer " , "") || req.cookies.accessToken ;

        
        
        if(!token){
            throw new ApiError(401, "Unauthorized request");
        }

        
    
        const decodedToken =  jwt.verify(token, process.env.JWT_SECRET);

        
        console.log({decodedToken})
        const user = await User.findById(decodedToken.id).select("-password -refreshToken");


        
        if(!user){
            throw new ApiError(401, "Invalid token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }

})

export { 
    verifyJwt as authenticate 
};