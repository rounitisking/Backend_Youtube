// we can connect with the db by using of the iffi function ()()  -- iffi fuction is used to when we want the function to be executed at that time only
//earlier we use to body parser to handle the json data i the backedn
// when we use extendede tru in the urlencoded we are saying to the server that in url if a object has object plz also accept that 
//to send data in the url :
// 1. name=rounit&age=20 -- this can be handeled by the simple urlencoded
// 2. user[name]=rounit&user[age]=20 or items[]=apple&items[]=banana -- this is used whn storing of teh array   -- this type of data is handeled by the extended = true

// when i want to store the files and the pdf we use express.static() to tell the server we are storing the files inthe server
// req.get -- iske callback function mai 4 params hota hai (error, req , res , next)


//in route we write api/v1 -- here v1 means 
import express, { Router } from "express";
import cors from "cors"
import cookieparser from "cookieparser"
const app = express()

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true , limit : "16kb"})) 
app.use(express.static("Public"))
app.use(cookieparser)

//here we will be writting the cors
const corsOption = {
    origin : process.env.BASE_URL ,
    credentials : true
}
app.use(cors(corsOption))


//routes
import router from "../src/router/users.router.js"

app.use("/api/v1/users" , router)

export default app