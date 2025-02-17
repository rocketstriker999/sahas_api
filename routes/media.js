const libExpress = require("express");
const { getMediaBySubjectId, getMediaByChapterId, extractMediaBySubjectIdAndMediaId } = require("../db/media");
const { verifyAccessByTokenForChapter } = require("../db/accesses");
const { requestService } = require("../utils");

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
    if (req.cookies.token && req.params.chapterId) {
        if (await verifyAccessByTokenForChapter(req.cookies.token, req.params.chapterId)) {
            const content = await getMediaByChapterId(req.params.chapterId);
            return res.status(200).json(content);
        }
        return res.status(401).json({ error: "You Don't Have access to this content" });
    }
    return res.status(400).json({ error: "Missing Required Details" });
});

//get the media source for a video and pdf
router.get("/subjects/:subjectId/extract/:mediaId", async (req, res) => {
    if (req.params.subjectId && req.params.mediaId) {
        const media = await extractMediaBySubjectIdAndMediaId(req.params.subjectId, req.params.mediaId);
        if (media)
            return requestService({
                requestServiceName: process.env.SERVICE_MEDIA,
                requestPath: `extract`,
                requestMethod: "POST",
                requestPostBody: media,
                onResponseReceieved: (sources, responseCode) => res.status(responseCode).json({ sources }),
                onRequestFailure: (e) => res.status(500).json({ error: `Media Item Not Ready For Stream ${e}` }),
            });
        return res.status(400).json({ error: "Invalid Media Request" });
    }
    return res.status(400).json({ error: "Missing Required Details" });
});
module.exports = router;
