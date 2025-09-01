//here multer has req and an additional file -- file that user will send , cb is that callback
//cb has two arguments null and path of the folder where the file will be stored 

import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) 
    cb(null, file.originalname) //+ '-' + uniqueSuffix -- they were written inside it
  }
})

const upload = multer({ storage: storage })

export default upload