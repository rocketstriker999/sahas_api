const libExpress = require("express");
const logger = require("../libs/logger");
const { requestService } = require("sahas_utils");

const router = libExpress.Router();

//tested
router.post("/:type", async (req, res) => {
    await requestService({
        requestServiceName: process.env.SERVICE_MEDIA,
        onRequestStart: () => logger.info(`Generating Media ${req.params.type}`),
        requestPath: `bucketise/${req.params.type}`,
        requestMethod: "POST",
        requestPostBody: req.body,
        onResponseReceieved: (response, responseCode) => {
            logger.info(responseCode);
            logger.info(JSON.stringify(response));
            res.status(responseCode).json(response);
        },
    });
});

module.exports = router;
