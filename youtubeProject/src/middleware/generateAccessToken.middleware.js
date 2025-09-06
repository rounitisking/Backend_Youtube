//access token ko check kro ki vo valid hai ya nhi 
//agarnhi hai then generate one and push it into the cookies by verifying the refresh token

import { asyncHandeler } from "../utils/asyncHandeler.js"
import {ApiError} from "../utils/api.error.js"
import {ApiResponse} from "../utils/api.response.js"
import jwt from "jsonwebtoken"
import User from "../model/users.model.js"


export const generateAccessToken = asyncHandeler(async (req, res , next)=>{


        const token = req.cookies?.AccessToken || req.header.Authorization?.replace("Bearer","")

        if(!token){
            return res.status(400).json(
                new ApiError(400 , "token not foudn plz first login , error occured in the generate access token")
            )
        }

        const IsValid = await jwt.verify(token , process.env.JWT_ACCESS_TOKEN_SECRET)

        if(IsValid){
            next()
        }

        const IsValidRefreshToken = req.cookies?.RefreshToken || req.body.RefreshToken || ""

        if(!IsValidRefreshToken){
            return res.status(400).json(
                new ApiError(400 , "refresh token is not valid login again , error occured in the generate access token")
            )
        }

        const isNotExpiredRefreshToken = await jwt.verify( IsValidRefreshToken , process.env.JWT_REFRESH_TOKEN_SECRET)

        if(!isNotExpiredRefreshToken){
            return res.status(400).json(
                new ApiError(400 , "refresh token is not valid login again , error occured in the generate access token")
            )
        }
        
        const user = await User.findById(isNotExpiredRefreshToken._id).select("-password")
        
        if(user){

                if(IsValidRefreshToken != user.refreshToken){
                    return res.status(400).json(
                new ApiError(400 , "token not foudn plz first login , error occured in the generate access token")
            )

                }


                const newToken = await user.generateAccessToken()

                if(!newToken){
                    return res.status(400).json(
                new ApiError(400 , "token not foudn plz first login , error occured in the generate access token")
            )
            }
            // adding the new token in the cookies

            const options = {
                httpOnly : true,
                        secure : true,
                        maxAge : 20*60*600*1000
            }
            return res.status(200).cookies("AccessToken" , newToken , options ).json(
                new ApiResponse(200 , user , "access token generated succesfully")
            )
                
            
        
            
        }
     else{
        return res.status(400).json(
                        new ApiError(400 , "user not found , error occured in the generate access token")
                    )

     }

     next()
})


