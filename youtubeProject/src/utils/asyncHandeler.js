//promise ek object hai jiske 3 stages hote hai pending , resolve , reject



//this is written in try catch  
// const asyncHandeler = (function )=> async(req,res ,next)=>{
            
//             try {
//                 await function(req , res , next)
//             } catch (error) {
//                 res.status(400).json({
//                     succes : false ,
//                     message : "error occured by async handeler"
//                 })
//             }
//         }



// writing the async handeler with the promise
const asyncHandeler = (requestHadeler)=>{
        return (req, res , next)=>{
            promise.resolve(requestHadeler())
            .catch((err)=>next(err)) // agar koi error ata hai tho usse next() mai bhej do
        }
}

export {asyncHandeler}