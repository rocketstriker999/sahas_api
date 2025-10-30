const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const logger = require("../libs/logger");
const { readConfig } = require("../libs/config");
const { get } = require("../libs/cacher");
const { CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS } = require("../constants");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["status", "txnid"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    const { paymentGateWay: { redirectionHost } = {} } = await readConfig("app");

    //verify into payu if payment is success

    logger.info(JSON.stringify(get(CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS)));

    if (isRequestBodyValid) {
        const transaction = get(CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS)?.find(({ id }) => id == validatedRequestBody.txnid);
        logger.info(transaction);

        res.redirect(redirectionHost);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
