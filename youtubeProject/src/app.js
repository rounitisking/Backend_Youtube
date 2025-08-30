import express from "express";
import DB_CONNECT from "../src/db/db.connect.js"
app.use(express.json())
app.use(express.urlencoded())
const port = 3000 || process.env.PORT
//her ewe will be writting the cors

const app = express()

try {
    DB_CONNECT()
    .then(
        app.listen(port , ()=>{
            console.log(`server is connected to the http://localhost/${port}`)
        })
    )
} catch (error) {
    console.log("error occured while connecting with the db in app.js file")
}





