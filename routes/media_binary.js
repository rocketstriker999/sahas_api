const libExpress = require("express");
const router = libExpress.Router();
const libMulter = require("multer");

const uploadManager = libMulter({ dest: process.env.DIRECTORY_UPLOAD_BINARIES });

router.post("/upload", uploadManager.single("file"), (req, res) => {
    console.log("File received:", req.file);
    res.json({ success: true, file: req.file });
});

module.exports = router;
