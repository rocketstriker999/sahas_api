const libExpress = require("express");
const { getMediaBySubjectId, getMediaByChapterId, extractMediaBySubjectIdAndMediaId } = require("../db/media");
const { verifyAccessByTokenForChapter } = require("../db/accesses");
const { getUserByToken } = require("../db/users");

const router = libExpress.Router();

//request for demo content from subjectid
router.get("/subjects/:subjectId", async (req, res) => {
    if (req.params.subjectId) {
        const content = await getMediaBySubjectId(req.params.subjectId);
        return res.status(200).json(content);
    }
    return res.status(400).json({ error: "Missing Content subjectId" });
});

//request for content from chapterId
router.get("/chapters/:chapterId", async (req, res) => {
    if (req.cookies.token && req.params.chapterId && (user = await getUserByToken(req.cookies.token))) {
        //cehck if this user has access to course
        if (await verifyAccessByTokenForChapter(req.cookies.token, req.params.chapterId)) {
            //check if this device has access

            const content = await getMediaByChapterId(req.params.chapterId);
            return res.status(200).json(content);
        }
        return res.status(401).json({ error: "You Don't Have access to this content" });
    }
    return res.status(400).json({ error: "Missing Required Details" });
});

module.exports = router;
