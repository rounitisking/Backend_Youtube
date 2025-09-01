import { v2 as cloudinary} from "cloudinary";  // here we can assign the name of v2 as cloudinary -- it is allowed in nodejs es6
import fs from "fs"
import { url } from "inspector";

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});



    const uploadOnCloudinary = async(filePath)=>{
        try {
            if(!filePath) return null
    
            //upload the file on cloudinary
           const response = await cloudinary.uploader.upload(filePath ,{
                resource_type : "auto"
            })
    
            //file has been uploaded 
            console.log("file is uploaded on cloudinary", response.url)

            //removing the file from the server as file is uploaded
            if(response){
                fs.unlinkSync(filePath)
            }
    
            return response
        } catch (error) {
            //if i am using this fucntion it means that the file is uploaded on the server
           fs.unlinkSync(filePath) //remove the temprory saved file as the upload is failed 
           return null
        }
    }


    export default uploadOnCloudinary


// cloudinary.v2.uploader
// .upload("dog.mp4", {
//   resource_type: "video", 
//   public_id: "my_dog",
//   overwrite: true, 
//   notification_url: "https://mysite.example.com/notify_endpoint"})
// .then(result=>console.log(result));