import mongoose from "mongoose"

const TodoSchema = new  mongoose.Schema({

    content :{
      type : String,
      required : true
    },
    isCompleted : {
      type : Boolean,
      required : true,
      default : false
    },
    createdBy : {
      type : mongoose.Schema.Types.ObjectId,
      ref : "User",
      required : true
    },
    subTodo : [{
      type : mongoose.Schema.Types.ObjectId,
      ref : "SubTodo"
    }]

} , {timestamps : true})

const Todo = mongoose.model("Todo" , TodoSchema)

export default Todo;