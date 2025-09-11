const libExpress = require("express");
const router = libExpress.Router();
const libMulter = require("multer");
const libPath = require("path");

const storage = libMulter.diskStorage({
    destination: (req, file, next) => {
        next(null, process.env.DIRECTORY_UPLOAD_BINARIES);
    },
    filename: (req, file, next) => {
        next(null, `${Date.now()}${libPath.extname(file.originalname)}`);
    },
});

router.post("/", libMulter({ storage }).single("file"), (req, res) => {
    res.status(201).json({ success: true, file: req.file });
});

module.exports = router;
