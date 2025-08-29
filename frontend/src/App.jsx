
// Log ise backend ke andar rakh dete hain (jaise public/ folder of Express) kyunki:
// we use fetch to send the req to the backend
//in proxy we create a variable of the baseurl
// when we are not using the proxy -- tho ye request direct browser → backend request hai.-- yaha pe frontend ka route 5173 hai so different origin ho gaya
//if we use cors then the rq goes from browser to the react dev server jiska origin same hai to the backend and tha'st how the cors are bypassed
// after the project goes into production the build script from the package is run in the production and then a build folder is created  which contains the static files like html css and js , images - staic files are the files which are server as it by the server without making any changes




// why the build file is kept inside the backend file -- build file is created using npm run build in which static files are kept 
/*
🔹 1. Why React static assets are kept in backend folder?

React jab tu build karta hai (npm run build), wo ek build folder banata hai jisme static assets (HTML, CSS, JS, images) hote hain.

Single deployment point → Backend aur frontend dono ek hi server se serve honge, alag hosting ki zarurat nahi.

CORS problem avoid → Same domain pe static files aur APIs chal rahi hongi.

Cost saving → Alag se Netlify/ Vercel + Render/ Railway use karne ki zarurat nahi, ek hi server pe sab chalega.

🔹 2. Pipelin(e)ing kya hota hai?

Pipeline = software delivery process automation.
Matlab tu code likhta hai → test hota hai → build banta hai → deploy hota hai.

CI/CD pipeline (Continuous Integration / Continuous Deployment) hota hai jisme har push ke baad ye steps automatic chal jate hain.

Agar tu alag frontend + backend deploy karega to do pipeline maintain karni padegi.

Agar ek hi repo/server pe rakha to ek pipeline se dono ka build aur deploy ho jayega → time & infra cost dono bachte hain.

🔹 3. Server cost bachana

Agar tu React frontend alag host karega (Netlify/Vercel) aur backend alag (Render/EC2/Railway), to:

2 jagah hosting charges lagenge (ya free plans ke limits cross ho sakti hain).

2 jagah monitoring + scaling handle karna padega.

But agar tu React ka build backend ke andar hi rakh de:

Sirf ek hi server/domain maintain karna hoga.

Bandwidth aur infra ka load ek hi server pe hoga.

Cost kam aur management easy.

👉 Simple line me:
Static assets backend folder me rakhne ka main reason hai → ek hi server se sab chalana, CORS aur multiple pipeline ke jhanjhat ko avoid karna, aur cost bachaana.
*/






import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"
import { useEffect } from 'react'

function App() {
  const [jokes,setJokes] = useState([])  // 
    useEffect(()=>{
      axios.get("/api/joke") // here we have applied proxy
      .then((res)=>{
        setJokes(res.data)
      })
    .catch((err)=>{
      console.log("error occured in the app.jsx file")
    })
  })
  return (
    <>
        <p> Rounit singh</p>
        
         { 
         jokes.map((joke ,index)=>(
              <div id = {joke.id}>
              <h1>{joke.title}</h1>
              <h3> {joke.content}</h3>
              </div>
         )
          )
          } 
        
    </>
  )
}

export default App
