//aap create
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
require('dotenv').config()
//port
const PORT = process.env.PORT || 3000;
//middleware
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));;
app.use(express.json());

//db conn
const db = require("./config/database");
db.connect();
//conn cloudinary
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();
//api route mount karna hai
const Upload = require("./routes/FileUpload");
app.use('/api/v1/upload', Upload);
//activate server
app.listen(PORT, () => {
    console.log('app is running at ',PORT);
})
