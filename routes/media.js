const libExpress = require("express");
const logger = require("../libs/logger");
const { requestService } = require("sahas_utils");

const router = libExpress.Router();

//tested
router.post("/:type", async (req, res) => {
    await requestService({
        requestServiceName: process.env.SERVICE_MEDIA,
        onRequestStart: () => logger.info("Generating Media"),
        requestPath: req.params.type,
        requestMethod: "POST",
        requestPostBody: req.body,
        onResponseReceieved: (response, responseCode) => {
            res.status(responseCode).json(response);
        },
    });
});

module.exports = router;
