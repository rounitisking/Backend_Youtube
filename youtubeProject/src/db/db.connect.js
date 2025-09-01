import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const DB_CONNECT = async()=>{
    
   try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`) // it returns the resopnse after connecting
    
         console.log(`db connected successfully  : ${connectionInstance.connection.host}`)
     
     
         
        } catch (error) {
       console.log("error occured in while connecting with the db in the db.connect.js file"),
       process.exit(1)  //node give us process
    
   }
}

export default DB_CONNECT;