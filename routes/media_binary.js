const libExpress = require("express");
const router = libExpress.Router();
const libMulter = require("multer");
const libPath = require("path");

const uploadManager = libMulter({
    storage: libMulter.diskStorage({
        filename: (req, file, next) => {
            next(null, Date.now() + libPath.extname(file.originalname));
        },
        destination: (req, file, next) => {
            next(null, process.env.DIRECTORY_UPLOAD_BINARIES);
        },
    }),
});

router.post("/upload", uploadManager.single("file"), (req, res) => {
    console.log("File received:", req.file);
    res.json({ success: true, file: req.file });
});

module.exports = router;
