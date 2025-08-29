import { Timestamp } from "bson"
import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema({
        name :{
          type : String,
          required : true,

        },
        discription : {
          type : String,
          required : true,

        },
        price : {
          type : Number,
          default : 0
        },
        stock : {
          type : Number,
          default : 0
        },
        catagory : {
          type : mongoose.Schema.Types.ObjectId,
          ref : "Catagory"
        },
        image : {
          type : String,
          required : true
        },
        seller : {
          type: mongoose.Schema.Types.ObjectId,
          ref : "User"
        }
},{Timestamp : true})

const Product = mongoose.model("Product" , ProductSchema)

export default Product;