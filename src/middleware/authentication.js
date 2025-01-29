import jwt from 'jsonwebtoken'
import customError from '../utils/customError'

const verifyToken = (req,res,next)=>{
    try{
        const authHeader = req.header.token;
        if(!authHeader){
            return next(new customError("Authentication token missing", 401));
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            return next(new customError("Authentication token not provided", 403))
        }
    }catch(err){

    }
}