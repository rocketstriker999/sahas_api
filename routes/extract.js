const libExpress = require("express");
const { extractMediaBySubjectIdAndMediaId, extractMediaByChapterIdAndMediaId } = require("../db/media");
const { requestService } = require("../utils");
const logger = require("../libs/logger");
const { Readable } = require("stream");

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

    const media = await extractMediaByChapterIdAndMediaId(req.params.chapterId, req.params.mediaId);

    requestService({
        requestGetQuery: req.query,
        requestServiceName: process.env.SERVICE_MEDIA,
        requestPath: `extract/${media.type}/${media.cdn_id}`,
        onRequestStart: () => {
            logger.info(`Extracting Media - ${media.type} - ${media.cdn_id}`);
        },
        onResponseReceieved: async (sources, responseCode) => {
            if (responseCode === 200) {
                if (media.type === "video" && sources.length) {
                    logger.success(`Extracted Media - ${media.type} - ${media.cdn_id} - ${sources.length} Sources`);
                    return res.status(200).json(sources);
                }

                if (media.type === "pdf") {
                    logger.success(`Extracted Media - ${media.type} - ${media.cdn_id} `);
                    const resourceResponse = await fetch(sources?.stream);
                    return Readable.fromWeb(resourceResponse.body).pipe(res);
                }
            }
            return res.status(500).json({ error: "Error While Generating Sources" });
        },
        onRequestFailure: (error) => {
            logger.error(`Failed To Extract Media - ${media.type} - ${media.cdn_id} `);
            res.status(500).json({ error });
        },
    });
});

module.exports = router;
