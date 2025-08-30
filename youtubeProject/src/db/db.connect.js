import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const DB_CONNECT = async()=>{
    
    await mongoose.connect(process.env.MONGODB_URI)
    .then(
        console.log("db connected successfully")
    )
    .catch(
        console.log("error occured in while connecting with the db in the dbc.connect.js file")
    )
}

export default DB_CONNECT;