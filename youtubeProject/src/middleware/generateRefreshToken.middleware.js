// agar refresh token expire krta hai tho user ko login krwana parta hai 
// ham cookies se refresh token lenge 
// refresh token vo verify karenge 
// agar sahi hoga tho next
// agar token expired hoga then user ko bolo ki login kre dubara se 

import {asyncHandeler} from "../utils/asyncHandeler.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import {ApiError} from "../utils/api.error.js"

dotenv.config()


export const generateRefreshToken = asyncHandeler(async (req, res, next)=>{

        const RefreshToken = req.cookies?.RefreshToken || req.body.RefreshToken

        if(!RefreshToken){
                return res.status(400).json(
                new ApiError(400 , "token not found plz first login , error occured in the generate refresh token")
            )
        }

        const isValid = await jwt.verify(RefreshToken , process.env.JWT_REFRESH_TOKEN_SECRET)

        if(isValid){
            next()
        }
        else{
            return res.status(400).json(
                new ApiError(400 , "token not found plz first login , error occured in the generate access token")
            )
        }

        next()
})