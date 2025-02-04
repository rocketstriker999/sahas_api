const libExpress = require("express");
const { getDemoContentBySubjectId, getChapterContentByChapterId } = require("../db/content");
const { verifyAccessByTokenForChapter } = require("../db/accesses");

const router = libExpress.Router();

//request for demo content from subjectid
router.get("/demo/:subjectId", async (req, res) => {
    if (req.params.subjectId) {
        const content = await getDemoContentBySubjectId(req.params.subjectId);
        return res.status(200).json(content);
    }
    return res.status(400).json({ error: "Missing Content subjectId" });
});

//request for content from chapterId
router.get("/content/:chapterId", async (req, res) => {
    if (req.cookies.token && req.params.id) {
        if (await verifyAccessByTokenForChapter(req.cookies.token, req.params.chapterId)) {
            const content = await getChapterContentByChapterId(req.params.chapterId);
            return res.status(200).json(content);
        }
        return res.status(401).json({ error: "You Don't Have access to this content" });
    }
    return res.status(400).json({ error: "Missing Required Details" });
});

module.exports = router;
