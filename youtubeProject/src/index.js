// we can what files not to include in the git can be know by visiting the site know as gitignore generater

import dotenv from "dotenv"
import DB_CONNECT from "../src/db/db.connect.js"
import app from "./app.js"
dotenv.config({ path : './env'})
const port = 3000 || process.env.PORT

try {
    DB_CONNECT()
    // write this in db.connect.js
    // app.on("error" , (err)=>{  // app.on is a istner that is used to listen the events in this we are listening error
    //         console.log("app cannot talk to the db in app.js")
    // })
    .then(
        ()=>{
            app.listen(port , ()=>{
            console.log(`server is connected to the http://localhost/${port}`)
        })
        }
    )
} catch (error) {
    ()=>{
        console.log("error occured while connecting with the db in index.js file" , error)
     
    }
}

