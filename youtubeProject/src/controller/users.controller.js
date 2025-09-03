//jsonwebtoken is a bearer token
//middleware adds extra fields in the req

import {asyncHandeler} from "../utils/asyncHandeler.js"
import mongoose from "mongoose"
import {ApiError} from "../utils/api.error.js"
import {ApiResponse} from "../utils/api.response.js"
import crypto from "crypto"
import User from "../model/users.model.js"
import { basename } from "path/win32"
import uploadOnCloudinary from "../utils/cloudinary.js"

const registerUser = asyncHandeler(async (req,res)=>{
        //pehle user se data lo 
        // valiate whether the data s correct or not
        //validation alag file mai hoga -- abhbi ke liye yaha kr rhe hai 
        //checkc if the user has sent the image or not and
        //  if it is uploaded on the cloudnary or not
        //find the user in the db if not 
        // create a user in the db 
        //generate a verification token 
        //send the verification token in the mail 


        const {fullName , email , password , username } = req.body

        if(!fullName && !email && !password && !username){
                 return  res.status(400).json(
                        new ApiError(400 , "all field sare required")
                )
                
        }

        // const ExsistingUser = await User.findOne({fullName , email}) 
        //or u find like this
        const ExsistingUser = await User.findOne(
                {$or : [{email} , {username}]}
        )

        if(ExsistingUser){
              return  res.status(400).json(
                        new ApiError(400 , "user already exsist error occured in the registration controller")
                )
        }

        //these fields are added by the multer in the req
        const avatarLocalPath = req.files?.avatar[0]?.path
        const coverImageLocalPath = req.files?.coverImage[0]?.path

        if(!avatarLocalPath){
                return  res.status(400).json(
                        new ApiError(400 , "avatar photo is required")
                )
        }
        
        if(!coverImageLocalPath){
                return  res.status(400).json(
                        new ApiError(400 , "coverImage photo is required")
                )
        }
        
        
        //uploading the file recived from the user in the cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        
        if(!avatar){
                return  res.status(400).json(
                        new ApiError(400 , "error occured while uploading the avatar image in the cloudinary")
                )
        }
        
        if(!coverImage){
                return  res.status(400).json(
                        new ApiError(400 , "error occured while uploading the coverImage image in the cloudinary")
                )
        }

        
        const user = await User.create({fullName , email , password , username , avatar : avatar.url , coverImage : coverImage.url})
        
        if(!user){

                return  res.status(400).json(
                          new ApiError(400 , "error occured while registering the user,error in the registration controller")
                  )
        }


        //generating a verification token
        
        const verificationToken = User.verificationTokenGeneration()

        //storing the hashed token in the db and sending the mail with the hashed token

        if(!verificationToken){
                return  res.status(400).json(
                        new ApiError(400 , "cannot generate the verification token,error in the registration controller")
                )
        }
        user.verificationToken = verificationToken.hashedToken
        await user.save()

        const data = User.findOne({id : user._id}).select("-password -refreshToken")
        return res.status(200).json(
                new ApiResponse(200, data, "user registration completed")
        )


        //sending the mail

})


const loginUser = asyncHandeler(async (req, res)=>{
        // take data from the user -- email , password 
        //validate the password -- validation will be one in the validator file 
        //find the user on the basis of email
        //password ko bcrypt se compare kro
        // ek refresh token generate kro and ek access token
        //cookies mai push krdo


        
})
const logoutUser = asyncHandeler(async (req, res)=>{

})


export {registerUser , loginUser}