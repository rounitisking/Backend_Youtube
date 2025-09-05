
import cookieParser from "cookieParser"
 
import {asyncHandeler} from "../utils/asyncHandeler.js"
import User from "../model/users.model.js"

const IsLoggedin = asyncHandeler(async (req, res , next())=>{

        try {
            
                        const Token = req.cookies.AccessToken

            if(!Token){
                       return res.status(400).json(
                    new ApiError(400 , "user is not loggedin , error occured in the login middleware")
                )
            }

            const IsVerified = jwt.verify(Token)

            if(!IsVerified){
                     return res.status(400).json(
                        new ApiError(400 , "user not loggedin , error occured in the login middleware")
                )
            }

            const user = await User.findOne({_id : IsVerified._id}).select("-password -refreshToken")

            req.user = user


            next()
        } catch (error) {
            console.log("error occure in the isLoggedin controller")
        }
})

export default IsLoggedin;