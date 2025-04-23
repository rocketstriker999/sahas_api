const libExpress = require("express");
const { extractMediaBySubjectIdAndMediaId, extractMediaByChapterIdAndMediaId } = require("../db/media");

const router = libExpress.Router();

//Subject Content extractions
router.get("/subjects/:subjectId/:mediaId", async (req, res) => {
    if (req.params.subjectId && req.params.mediaId) {
        const media = await extractMediaBySubjectIdAndMediaId(req.params.subjectId, req.params.mediaId);
        return res.redirect(301, `/${process.env.SERVICE_MEDIA}extract/${media.type}/${media.cdn_id}`);
    }
    return res.status(400).json({ error: "Missing Required Details" });
});

//Chapter Content extractions
router.get("/chapters/:chapterId/:mediaId", async (req, res) => {
    if (req.params.chapterId && req.params.mediaId) {
        const query = new URLSearchParams(req.query).toString();
        console.log("######################### CALLED", query);
        const media = await extractMediaByChapterIdAndMediaId(req.params.chapterId, req.params.mediaId);
        const redirectUrl = `/${process.env.SERVICE_MEDIA}extract/${media.type}/${media.cdn_id}${query ? `?${query}` : ""}`;
        console.log(redirectUrl);
        return res.redirect(301, redirectUrl);
    }
    return res.status(400).json({ error: "Missing Required Details" });
});

module.exports = router;
