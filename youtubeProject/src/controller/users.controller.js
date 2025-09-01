//jsonwebtoken is a bearer token


import asyncHandeler from "../utils/asyncHandeler.js"
import mongoose from "mongoose"
import {ApiError} from "../utils/api.error.js"
import {ApiResponse} from "../utils/api.response.js"
import crypto from "crypto"
import User from "../model/users.model.js"
import { basename } from "path/win32"

const registerUser = asyncHandeler(async (req,res)=>{
        //pehle user se data lo 
        // valiate whether the data s correct or not
        //validation alag file mai hoga
        //find the user in the db if not 
        // create a user in the db 
        //generate a verification token 
        //send the verification token in the mail 


        const {fullName , email , password} = req.body

        //validation is done in the validation file

        const ExsistingUser = await User.findOne({fullName , email})

        if(ExsistingUser){
              return  res.status(400).json(
                        new ApiError(400 , "user already exsist error occured in the registration controller")
                )
        }
        
        const user = await User.create({fullName , email , password})
        
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
basename
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