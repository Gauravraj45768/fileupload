const File = require("../models/File");
const cloudinary = require("cloudinary").v2;
//localfile upload ->handler
exports.localFileUpload = async (req, res) => {
    try {
        //fetch file
        const file = req.files.file;
        console.log(file);
        const myArray = file.name.split(".");
        let path = __dirname + "/files/" + Date.now()+'.'+myArray[1];
        //console.log("path",path);
        await file.mv(path, (err) => {
            console.log(err);
        })
        res.json({
            success: true,
            message:'localfile upload successfully',
        })
    } catch (error) {
        console.log(error);
    }
}
async function uploadFileToCloudinary(file, folder) {
    const options = { folder };
    options.resource_type = "auto";
   return await cloudinary.uploader.upload(file.tempFilePath,options);
}
function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}
//image upload ka handler
exports.imageUpload = async (req, res) => {
    try {
        //data fetch
        const { name, tags, email } = req.body;
        console.log(name, tags, email);
         console.log("hi");
        const file = req.files.imageFile;
        console.log(file);
        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
          console.log("hi");
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log(fileType);
        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                message: "unsupported image type",
                success:false,
            })
        }
        console.log("hi");
        //file format supported hai
        const response = await uploadFileToCloudinary(file, "images");//folder->images
        //db me entry save kafro 
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })
        console.log(fileData);
        console.log(file.tempFilePath);
        console.log(response);
        res.json({
            success: true,
             imageUrl:response.secure_url,
            message:"Image uploaded to Cloudinary",
        })
    } catch (error) {
        res.status(500).send('server error');
    }
}