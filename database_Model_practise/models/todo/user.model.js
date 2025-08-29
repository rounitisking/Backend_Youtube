import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({

  username : {
    type : String,
    unique : true,
    required : true
  },
   email : {
    type : String,
    required : true,
    unique : true,
    lowercase : true

  },
  password  : {
    type : String,
    required: [true , "password is required"] 
  }
}, {timestamps : true})


const User = mongoose.model("User"  , UserSchema)
export default User;