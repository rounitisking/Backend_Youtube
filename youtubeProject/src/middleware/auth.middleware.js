

import jwt from "jsonwebtoken"
import {asyncHandeler} from "../utils/asyncHandeler.js"
import User from "../model/users.model.js"
import {ApiError} from "../utils/api.error.js"
import dotenv from "dotenv"
dotenv.config()

const IsLoggedin = asyncHandeler(async (req, res , next)=>{

        try {
            
                        const Token = req.cookies?.AccessToken || req.header("Authorization")?.replace("Bearer" , "")   // kabhi kabhi hame access token ookie mai nhi  milta hia kyuki ham access token phone mai header mai bhejte hai 

            if(!Token){
                       return res.status(400).json(
                    new ApiError(400 , "user is not loggedin , error occured in the auth middleware")
                )
            }

            const IsVerified = await jwt.verify(Token , process.env.JWT_ACCESS_TOKEN_SECRET)

            if(!IsVerified){
                     return res.status(400).json(
                        new ApiError(400 , "user not loggedin , error occured in the auth middleware")
                )
            }

            const user = await User.findOne({_id : IsVerified._id}).select("-password -refreshToken")

            if(!user){
                return res.status(400).json(
                        new ApiError(400 , "user not found, error occured in the auth middleware")
                )
            }

            req.user = user


            next()
        } catch (error) {
            console.log("error occure in the isLoggedin controller")
        }
})

export default IsLoggedin;