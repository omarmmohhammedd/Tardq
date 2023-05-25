const multer = require("multer")
const fs = require('fs')

// Setup Multer Instance
module.exports = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (!fs.existsSync('images')) fs.mkdirSync('images')
            cb(null, 'images')
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "__" + file.originalname)

        }
    }), fileFilter: function (req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
})