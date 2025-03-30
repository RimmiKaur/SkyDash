const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Middleware Function to Set Dynamic Folder
const dynamicStorage = (folderName) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            if (!file) return cb(null, false); // If no file, skip saving

            const uploadPath = `uploads/${folderName}/`;

            // ✅ Create folder if it doesn't exist
            if (!fs.existsSync(uploadPath)) {
                console.log("ddasdsadasdas");
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            console.log("11111111ddasdsadasdas");


            cb(null, uploadPath); // Save files in dynamic folder
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname); // Append timestamp to filename
        }
    
    });
};

// ✅ File Filter (Allow only images)
const fileFilter = (req, file, cb) => {
    if (!file) return cb(null, false); // Allow requests without files

    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};


// ✅ Function to Create Multer Instance with Dynamic Folder
const upload = (folderName) => multer({
    storage: dynamicStorage(folderName),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

module.exports = upload;
