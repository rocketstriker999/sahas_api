const libExpress = require("express");
const router = libExpress.Router();

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

router.post("/image", libExpress.raw({ type: "image/*", limit: "10mb" }), (req, res) => {
    try {
        const buffer = req.body; // raw image buffer

        if (!buffer || !buffer.length) {
            return res.status(400).json({ error: "No image received" });
        }

        // Use the same content type as the uploaded file
        const contentType = req.headers["content-type"] || "application/octet-stream";
        const filename = req.headers["x-filename"] || `upload-${Date.now()}.png`;

        // Set headers for download/preview
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

        // Send the image buffer back
        res.send(buffer);
    } catch (err) {
        console.error("Error processing file:", err);
        res.status(500).json({ error: "Failed to echo image" });
    }
});

module.exports = router;
