const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { logger } = require("sahas_utils");
const { readConfig } = require("../libs/config");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["txnid"];

    logger.info("CALEED");

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    logger.info("CALEED1");

    if (isRequestBodyValid) {
        const { paymentGateWay: { redirectionHost, postPaymentRoute } = {} } = await readConfig("app");
        logger.info("CALEED2");

        res.redirect(redirectionHost.concat(postPaymentRoute.concat(validatedRequestBody.txnid)));
        logger.info("CALEED3");
    }
    logger.info("CALEED4");
});

module.exports = router;
