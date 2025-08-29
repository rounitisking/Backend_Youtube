import mongoose, { mongo } from "mongoose"

const SubTodoSchema = new mongoose.Schema({
    content : {
      type : String,
      required : true,

    },
    complete : {
      type : Boolean,
      default : false,
      required : true
    },
    createdBy : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User"
    }
}, {timestamps : true })

const SubTodo = mongoose.model(SubTodo , SubTodoSchema )

export default SubTodo;