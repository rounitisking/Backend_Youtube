//sending req sing curl - we can send any type of req using the curl
// by default curl sends get request
// to send post req using the curl --- 
/* 
curl -X POST https://api.example.com/users \
     -H "Content-Type: application/json" \
     -d '{"name":"Rounit","age":20}'

  */


//to send put request using the curl ---
/*
curl -X PUT https://api.example.com/users/1 \
     -H "Content-Type: application/json" \
     -d '{"name":"Singh"}'

*/

// to send delete request using teh curl ---
/* 
curl -X DELETE https://api.example.com/users/1
*/


// why are we using the nodeomon ?
// we are using te nodemon because we do not want to relod the server manually when we update the code -- its like hot reload in the react when we change the code in the react the react has watcher which only changes the changed component on the server without reloding the whole page

// we always set the port in the enviornment variable because when we deploy the code on any application hosting platform they give a port so if it is hard coded it will give error so we give it in the env file so that it canbe change and it is secured

//react is a tool chain or bundeler -- ye sari html css vs code ko bundle krti hai 
import express from "express"
import dotenv from "dotenv"

const app = express()

const port = process.env.PORT || 4000

const darkJokes = [
  {
    id: 1,
    title: "Skeleton Joke",
    content: "Why don’t graveyards ever get overcrowded? Because people are dying to get in."
  },
  {
    id: 2,
    title: "Cremation Joke",
    content: "Why don’t crematoriums ever run out of clients? Because they urn it."
  },
  {
    id: 3,
    title: "Orphan Joke",
    content: "Why don’t orphans play hide and seek? Because no one looks for them."
  },
  {
    id: 4,
    title: "Depression Joke",
    content: "Why did the depressed person bring a ladder to the bar? To reach new lows."
  },
  {
    id: 5,
    title: "Hospital Joke",
    content: "Why don’t hospitals play music in the operating room? Because the organs keep leaving."
  }
];

app.get("/api/joke" ,(req, res)=>{
    res.send(darkJokes)
})

app.listen(port , (req , res)=>{
    console.log(`server is listening on port ${port}`)
})