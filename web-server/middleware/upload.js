const multer = require("multer");
const path = require("path");
// Added to handle file system operations
const fs = require("fs"); 

// Auto-create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads"); 
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("Created uploads folder automatically at:", uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

// File filter to allow only images
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only images allowed"));
        }
        cb(null, true);
    }
}); 

// Generic file upload (no file type restriction)
const uploadGeneric = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } 
});

module.exports = {
    upload,        
    uploadGeneric  
};
