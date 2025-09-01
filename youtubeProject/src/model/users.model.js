//working of the this.isModified function --
// returns value when :
//true → field was modified
// false → field was not modified


import mongoose , {Schema} from "mongoose"
import  {UserRoleEnum} from "./utils/constants.js"
import crypto from "crypto"
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config({
    path : "../env"
})
const UserSchema = new Schema({

    fullName : {
        type : String,
        required : true,
        trim : true,
        index : true
        
    },
    username : {
        type : String,
        required : true,
        index : true,
        trim : true,
        lowercase : true,
        unique : true,
        min : 3,
        max : 15
        
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
        
    },
    password : {
        type : String,
        required : [true , "password is required"],
        min : 6,
        trim : true
        
    },
    role : {
        type : String,
        required : true,
        enum : UserRoleEnum,
        default : UserRoleEnum.CREATOR
        
    },
    refreshToken : {
        type : String,
        required : true,
        
        
    },
    accessToken : {
        type : String,
        required : true,
        
        
    },
    watchHistory :[ {
        type : mongoose.Schema.Types.objectId(),
        ref : "Video"
        
        
    }],
    WatchLater : [{
        type : mongoose.Schema.Types.objectId(),
        ref : "Video"
        
        
    }],
    likedVideos : [{
        type : mongoose.Schema.Types.objectId(),
        ref : "Video"
        
        
    }],
    favVideos : {
        type : mongoose.Schema.Types.objectId(),
        ref : "Video"
        
        
    },
    verificationToken : {
        type : String,
        required :  true
        
        
    },
    verificationTokenExpiry : {
        type : Date,
        required :  true,
        default : Date.now()
        
        
    },
    isVerified : {
        type : boolean,
        required :  true,
        default : false
        
        
    },
    avatar : {
        type : String, // we are using cloudnary service
        required :  true,
                
        
    },
    coverImage : {
        type : String,
        required :  true,
        
        
        
    },

    


},{timestamps : true})

const User  = mongoose.model("User" , UserSchema)

UserSchema.pre("save" , async function(next){  // yaha pe ham callback fucntion ka use nhi kr skte kyuki callback ko this ka reference nhi paata hota
        if(this.isModified("password")){  //
            this.password = await bcrypt.hash(this.password , 10)
            next()
            }
        return next()
})


UserSchema.methods.isPasswordCorrect = async (pwd)=>{
    const isCorrect = await bcrypt.compare(pwd , this.password)
    if(!isCorrect){
        return res.status(400).json(
            {
                success : false,
                status : 400,
                message : "incorrect pasword enter the correct one , errror occured while check the pwd in isPasswordCorrect method"
            }
        )
    }

    return isCorrect
}


UserSchema.methods.generateAccessToken = async ()=>{
    
        const token = await jwt.sign({_id : this._id , email : this.email } , process.env.JWT_ACCESS_TOKEN_SECRET  , {expiresIn : process.env.JWT_ACCESS_TOKEN_EXPIRY} )
        return token
}
UserSchema.methods.generateRefreshToken = async ()=>{
    const token = await jwt.sign({_id : this._id , email : this.email , } , process.env.JWT_REFRESH_TOKEN_SECRET  , {expiresIn : process.env.JWT_REFRESH_TOKEN_EXPIRY} )
        return token
}


UserSchema.methods.verificationTokenGeneration = async ()=>{
        const unhashedToken = await crypto.rwandomBytes(32).toString("hex")
        const hashedToken = await crypto.createHash(process.env.CRYPTO_HASHING_SECRET).update(unhashedToken).digest("hex")
        const tokenExpiry = Date.now() + (20*60*1000)

        return {unhashedToken , hashedToken , tokenExpiry}
}
export default User;