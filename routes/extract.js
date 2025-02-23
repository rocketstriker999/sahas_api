const libExpress = require("express");
const { extractMediaBySubjectIdAndMediaId, extractMediaByChapterIdAndMediaId } = require("../db/media");

const { requestService } = require("../utils");

const router = libExpress.Router();

//get the media source for a video and pdf
router.get("/subjects/:subjectId/:mediaId", async (req, res) => {
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
        return res.status(400).json({ error: "Invalid Media Request - Media Not Found" });
    }
    return res.status(400).json({ error: "Missing Required Details" });
});

router.get("/chapters/:chapterId/:mediaId", async (req, res) => {
    if (req.params.chapterId && req.params.mediaId) {
        const media = await extractMediaByChapterIdAndMediaId(req.params.chapterId, req.params.mediaId);

        return res.redirect(301, `/${process.env.SERVICE_MEDIA}${media.type}/${media.cdn_id}`);
        // if (media.type === "video")
        //     return requestService({
        //         requestServiceName: process.env.SERVICE_MEDIA,
        //         requestPath: `extract`,
        //         requestMethod: "POST",
        //         requestPostBody: media,
        //         onResponseReceieved: (sources, responseCode) => res.status(responseCode).json({ sources }),
        //         onRequestFailure: (e) => res.status(500).json({ error: `Media Item Not Ready For Stream ${e}` }),
        //     });
        // return res.status(400).json({ error: "Invalid Media Request - Media Not Found" });
    }
    return res.status(400).json({ error: "Missing Required Details" });
});

module.exports = router;
