const libExpress = require("express");
const router = libExpress.Router();
const libMulter = require("multer");
const libPath = require("path");

const storage = libMulter.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.DIRECTORY_UPLOAD_BINARIES);
    },
    filename: (req, file, cb) => {
        const ext = libPath.extname(file.originalname); // .png, .jpg etc
        const baseName = libPath.basename(file.originalname, ext); // Hostinger_logo
        cb(null, `${baseName}-${Date.now()}${ext}`);
    },
});

const uploadManager = libMulter({ storage });

router.post("/upload", uploadManager.single("file"), (req, res) => {
    res.json({ success: true, file: req.file });
});

module.exports = router;
