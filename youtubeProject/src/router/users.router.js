import {Router} from "express"
import {registerUser , loginUser} from "../controller/users.controller.js"
import upload from "../middleware/multer.middleware.js"
 
const router = Router()

router.post("/registerUser" ,
    upload.fields([
        {
            name : "avatar",
            max : 1
        },{
            name : "coverImage",
            max : 1
        }
    ])  ,
    registerUser )


router.post("/LoginUser" , loginUser)

export default router