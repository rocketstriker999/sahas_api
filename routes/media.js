const libExpress = require("express");
const router = libExpress.Router();
import multer from "multer";

//request for demo content from subjectid
// router.get("/subjects/:subjectId", async (req, res) => {
//     if (req.params.subjectId) {
//         const content = await getMediaBySubjectId(req.params.subjectId);
//         return res.status(200).json(content);
//     }
//     return res.status(400).json({ error: "Missing Content subjectId" });
// });

// //request for content from chapterId
// router.get("/chapters/:chapterId", requiresUserDeviceActiveMapping, async (req, res) => {
//     if (req.params.chapterId) {
//         //cehck if this user has access to course
//         if (await verifyAccessByTokenForChapter(req.cookies.token, req.params.chapterId)) {
//             //check if this device has access

//             const content = await getMediaByChapterId(req.params.chapterId);
//             return res.status(200).json(content);
//         }
//         return res.status(401).json({ error: "You Don't Have access to this content" });
//     }
//     return res.status(400).json({ error: "Missing Required Details" });
// });

const upload = multer({ dest: "uploads/" });

router.post("/api/upload", upload.single("file"), (req, res) => {
    console.log("File received:", req.file);
    // req.file.size > 0 confirms it’s not empty
    res.json({ success: true, file: req.file });
});

module.exports = router;
