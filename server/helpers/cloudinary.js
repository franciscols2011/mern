const cloudinary = require ('cloudinary').v2;
const multer = require('multer');


cloudinary.config({
    cloud_name: 'dt70oe6ih',
    api_key: '788148946538895',
    api_secret: 'tJtNckho9PlY4kc7MOGFhEA5QdU'
});

const storage = new multer.memoryStorage();


async function imageUploadUtil(file) {
    const result = await cloudinary.uploader.upload(file,{
        resource_type: "auto"
    })

    return result;
}


const upload = multer({
    storage
});

module.exports = {upload, imageUploadUtil}