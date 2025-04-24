const libExpress = require("express");
const { extractMediaBySubjectIdAndMediaId, extractMediaByChapterIdAndMediaId } = require("../db/media");
const { requestService } = require("../utils");

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

        requestService({
            requestServiceName: process.env.SERVICE_MEDIA,
            requestPath: `extract/video/${media.cdn_id}`,
            onResponseReceieved: (sources, responseCode) => {
                if (responseCode === 200) return res.status(200).json(sources);
                return res.status(500).json({ error: "Error While Generating Sources" });
            },
            onRequestFailure: (error) => {
                res.status(500).json({ error });
            },
        });
    }
    return res.status(400).json({ error: "Missing Required Details" });
});

module.exports = router;
