const libExpress = require("express");
const router = libExpress.Router();
const libMulter = require("multer");
const libPath = require("path");

router.post(
    "/",
    libMulter({
        storage: libMulter.diskStorage({
            destination: (req, file, next) => {
                next(null, process.env.DIRECTORY_UPLOAD_BINARIES);
            },
            filename: (req, file, next) => {
                next(null, `${Date.now()}${libPath.extname(file.originalname)}`);
            },
        }),
    }).single("file"),
    (req, res) => {
        res.status(201).json({ file: req.file.filename });
    }
);

module.exports = router;
