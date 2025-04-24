const libExpress = require("express");
const { extractMediaBySubjectIdAndMediaId, extractMediaByChapterIdAndMediaId } = require("../db/media");
const { requestService } = require("../utils");
const logger = require("../libs/logger");

const router = libExpress.Router();

//Subject Content extractions
router.get("/subjects/:subjectId/:mediaId", async (req, res) => {
    if (req.params.subjectId && req.params.mediaId) {
        const media = await extractMediaBySubjectIdAndMediaId(req.params.subjectId, req.params.mediaId);
        return res.redirect(301, `/${process.env.SERVICE_MEDIA}extract/${media.type}/${media.cdn_id}`);
    }
    return res.status(400).json({ error: "Missing Required Details" });
});

//Chapter Content extractions #1
router.get("/chapters/:chapterId/:mediaId", async (req, res) => {
    if (!req.params.chapterId || !req.params.mediaId) {
        return res.status(400).json({ error: "Missing Required Details" });
    }

    logger.info("######################### CALLED");
    logger.info(JSON.stringify(req.query));

    const media = await extractMediaByChapterIdAndMediaId(req.params.chapterId, req.params.mediaId);

    requestService({
        requestServiceName: process.env.SERVICE_MEDIA,
        requestPath: `extract/${media.type}/${media.cdn_id}`,
        onRequestStart: () => {
            logger.info(`Extracting Media - CDN ID ${media.cdn_id}`);
        },
        onResponseReceieved: (sources, responseCode) => {
            if (responseCode === 200 && sources.length) return res.status(200).json(sources);
            return res.status(500).json({ error: "Error While Generating Sources" });
        },
        onRequestFailure: (error) => {
            res.status(500).json({ error });
        },
    });
});

module.exports = router;
