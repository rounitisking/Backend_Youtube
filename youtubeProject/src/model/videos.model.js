//mongooseAggregatePaginate is a puglin -- the difference between a puglin and a methdos is that we can use methods only with the specific schema we define it but in puglins we can use it with many schemas so here the plugins is a reusable code/method
// we can create a ser in the db by -- const user = new User({
// here we will be wrinting the values of the user 
// })


import mongoose , {Schema} from "mongoose"
import  {UserRoleEnum} from "./utils/constants.js"
import mongooseAggregatePaginate from "mongooseAggregatePaginate"

const VideoSchema = new Schema({

    VideoFile : {
        type : String,
        required : true,
        index : true
        
    },
    duration : {
        type : Number,
        required : true,
        
    },
    owner : {
        type : mongoose.Schema.Types.objectId(),
        ref: "User"
        
    },
    thumbnail : {   // it is a photo that we see befre seeing the video
        type : String,
        required : [true , "thumbnail is required"],
        
        
    },
    discription : {
        type : String,
        required : true,
        
        
    },
    title : {
        type : String,
        required : true,
        
        
    },
    views : {
        type : Number,
        required : true,
        default : 0
        
        
    },
    isPublic : {
        type : boolean,
        required : true,
        default : true
        
        
    },
    
    


},{timestamps : true})


VideoSchema.plugin(mongooseAggregatePaginate)

const User  = mongoose.model("User" , VideoSchema)
export default User;