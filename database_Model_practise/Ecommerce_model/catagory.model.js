import mongoose from "mongoose"

const CatagorySchema = new mongoose.Schema({
  name : {
    type : String,
    required : true
  }
},{timestamps: true})


const Catagory  = mongoose.model("Catagory" , CatagorySchema)

export default Catagory;