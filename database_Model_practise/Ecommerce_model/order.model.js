import mongoose from "mongoose"

const OrderItemSchema = new mongoose.Schema({ // iss schema ka use bas issifile mai use hai isliye we have written it here
    productId : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "Product"
    },
    quantity : {
      type : Number,
      required : true
    }
})


const OrderSchema = new mongoose.Schema({

      totalPrice :{
        type : Number,
        required :true,
        default : 0
      },
      customer : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
      },
      orderItem : {
        type : [OrderItemSchema]
      },
      orderStatus : {
        type : String,
        enum : ["PENDING" , "CANCELLED" , "DELIVERED"],
        default : "PENDING"
      }
       
    
    
    } , {timestamps : true})

const Order = mongoose.model("Order" , OrderSchema)

export default Order