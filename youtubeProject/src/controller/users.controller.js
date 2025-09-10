// when we allowing the user to change the file we generally write the login in the new controller

//jsonwebtoken is a bearer token
//middleware adds extra fields in the req
// $or , $and --  these are the operators of the mongo db

//we use validateBeforeSave = false when: 
// Model.create(), doc.save() , insertMany() -- Required fields check har save ke waqt hota hai.

// Agar wo fields pehle se fill hain → dusre controller mein sirf ek aur field update karne pe error nahi aayega.

// Error tabhi aayega jab required field missing ho ya aap usko deliberately null/undefined kar do.


//jab ham cookies ke options mai httpOnly and secure ko true krte hai tho cookies ko bas ham server se modify kr skte hai 

//when we write new : true in the options of the update method of the mongoose it will return the object of the updated values


//req.user._id - iss se hame ek string milti hai and jab ham findone function use krte hai tho mongoose isse mongodb ki object id mai convert kr deta hai 
// but when we write the aggregation pipeline the code is directly sent to the mongodb without converison so when we use match with the id we have to first convert the id into the object id of the mongoose

import {asyncHandeler} from "../utils/asyncHandeler.js"
import mongoose from "mongoose"
import {ApiError} from "../utils/api.error.js"
import {ApiResponse} from "../utils/api.response.js"
import crypto from "crypto"
import User from "../model/users.model.js"
import { basename } from "path/win32"
import uploadOnCloudinary from "../utils/cloudinary.js"
import bcrypt from "bcrypt"


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
        
        //
        await user.save({validateBeforeSave : false})

        const data = User.findOne({id : user._id}).select("-password -refreshToken")


        return res.status(200).json(
                new ApiResponse(200, data, "user registration completed")
        )


        //sending the mail

})



const ValidateUser = asyncHandeler(async (req,res)=>{

        // hamne jo user ko mail mai url bheja tha usse params se token lo
        // uss token ko db se verify krwao
        //agar verify ho jaye tho isverified ko tru krdo


        const {verificationToken} = req.params

        const user = await User.findOne({verificationToken : verificationToken})

        if(!user){
                return res.status(400).json(
                        new ApiError(400 , "verification token is not valid , error occured in the verify contoller")
                )
        }

        user.isVerified = true
        const IsUpdated = await user.save()

        if(!IsUpdated){
                return res.status(400).json(
                        new ApiError(400 , "error occured while saving the isverfied in the db , error occured in the verify controler")
                )
        }

        return res.status(200).json(
                        new ApiError(200 , "user is verified")
                )

                
})


const loginUser = asyncHandeler(async (req, res)=>{
        // take data from the user -- email , password 
        //validate the password -- validation will be one in the validator file 
        //find the user on the basis of email
        //password ko bcrypt se compare kro
        // ek refresh token generate kro and ek access token
        //cookies mai push krdo access token ko 
        //refresh token ko db mai push krdo



        const {email , password} = req.body

        //validation is done in the valdation file 

        const user = await User.findOne({email})
        if(!user){
                return res.status(400).json(
                        new ApiError(400 , "invalid email , error occured in the login controler")
                )
        }

        if(!user.isVerified){
                return res.status(400).json(
                        new ApiError(400 , "user is not verified plz first verify the user , error occured in the login controler")
                )
        }

        const IsPwdCorrect = await user.isPasswordCorrect(password)

        if(!IsPwdCorrect){
                return res.status(400).json(
                        new ApiError(400 , "invalid password , error occured in the login controler")
                )
                                 }


        const AccessToken = await User.generateAccessToken()

        const RefreshToken = await User.generateRefreshToken()

        if(!accessToken || !refreshToken){
                return res.status(400).json(
                        new ApiError(400 , "error occured while generation of the access token or the refresh token , error occured in the login controler")
                )
        }


                //setting up the access token in the cookies
                const cookieOption = {
                        httpOnly : true,
                        secure : true,
                        maxAge : 20*60*600*1000
                    }

                    
                    
                    
                    const UpdateRefreshTokenInDB = await User.updateOne(email , {$set : {refreshToken : RefreshToken}} , {upsert : true}, (err , res)=>{
                            if(err){return  res.status(400).json(
                                    new ApiError(400 , `errro occured in the login controller ${err.message}`)
                                )}
                        })
                        
                        if(!UpdateRefreshTokenInDB){
                                return res.status(400).json(
                                        new ApiError(400 , "refresh token is not saved in the db , error occured in the login controler")
                                )
                        }
                        
                        
                        const loginedUser = await User.findOne({_id : user._id}).select("-password -refreshToken")
                        
                        return res.status(200).cookies("AccessToken" , AccessToken , cookieOption).cookies("RefreshToken",RefreshToken, cookieOption ).json(
                                new ApiResponse(200 , {loginedUser, RefreshToken , AccessToken} , "user loggedin successfully")
                        )
                        
        
})


const logoutUser = asyncHandeler(async (req, res)=>{

        //ismai ham first check karenge ki user loggined hai ya nhi by using the login middleware 
        // refresh token and access token ko empty kr denge 
        // clear the cookies also      
        // ho gaya user logout


        const user = await User.findById(req.user._id).select("-password , -refreshToken")


        user.refreshToken = null
        user.accessToken = null

       const isChanged = await user.save({validateBeforeSave : false})

       if(!isChanged){
        
        return res.status(400).json(
                        new ApiError(400 , "error occured while logout the user, error occured in the logout controler")
                )
                
        }

        const options = {
                httpOnly : true,
                secure  : true
        }

        return res.status(200).clearCookie("AccessToken" ,options)
        .json(
                new ApiResponse(200 , user , "user logged out successfully")
        )
        
        
})


const DeleteAccountUser = asyncHandeler(async (req, res)=>{

})


const ChangeCurrentPasswordUser = asyncHandeler(async (req, res)=>{

})
const GetCurrentUser = asyncHandeler(async (req, res)=>{

})
const UpdateAccountDetailsUser = asyncHandeler(async (req, res)=>{

})
const UpdateAvatarUser = asyncHandeler(async (req, res)=>{

})
const UpdateCoverImageUser = asyncHandeler(async (req, res)=>{

})

// yaha ham kisi ke channel ke profile pe jaa rhe hai 
const getChannelProfileUser = asyncHandeler(async (req, res)=>{

        const {username} = req.params

        if(!username?.trim()){

                return res.status(400).json(
                        new ApiError(400 , "enter a valid username, errror occured in the get channel profile user controller")
                )

        }


        // yaha pr mujhe array-- jo ki ek channel hai -- usmai ek hi value milegi kyuki mane ek hi user ke liye match kiya hai and here channel is a array
        //project is used to return the selected values into the array
        const channel = await User.aggregate([
                {
                        $match : {
                                username : username.toLowerCase()
                        }
                },
                {
                        // here we are finding the number of subscribers the channel has
                        $lookup :{
                                from : "subscriptions",
                                localField: "_id",
                                foreignField: "channel",
                                as : "Subscriber"
                        }
                },
                
                // yaha pr ham ye find kr rhe hai ki hamne kis kis ko subscribe kiya hai
                {
                $lookup :{
                        from : "subscriptions",
                        localField : "_id",
                        foreignField : "subscriber",
                        as : "channelSubscribed"
                }
                },

                {
                        // this operator add additional fields additional to the model -- here in the user model
                        $addFeild : {
                                subscribersCount : {
                                        $size : "$Subscriber",
                                        
                                },
                                noOfChannelSubscribedCount : {
                                        $size  : "$channelSubscribed"
                                },
                                isSubscribed : {
                                        //cond has three parameters first one is the if ,then , else -- then is executed when the if is true and the else is executed when the if is false 
                                        $cond : {
                                                // this in can traverse the object and the array both
                                                if : {$in : [req.user?._id,"$Subscriber.subscriber"]},
                                                then : true,
                                                else: false
                                        }
                                }
                        }
                },

                {
                        $project : {
                                fullName : 1,
                                username : 1,
                                email : 1,
                                coverImage : 1,
                                avatar : 1,
                                subscribersCount:1,
                                noOfChannelSubscribedCount : 1,
                                isSubscribed : 1

                        }
                }
        ])

        

        if(!channel?.length){
                return res.status(400).json(
                        new ApiError(400 , "such channel does nt exsist, errror occured in the get channel profile user controller")
                )
        }
        
        
        return res.status(200).json(
                new ApiError(200 , channel[0] , "no of subscriber found")
        )
        


})


const getWatchHistory= asyncHandeler(async (req,res)=>{

        const user = await User.aggregate([
                {
                        $match : {
                                _id : new mongoose.Types.ObjectId(req.user._id)
                        }
                },
                {
                        $lookup : {
                                from : "Video",
                                localField : ""
                        }
                }
        ])

})


export {registerUser , loginUser}



