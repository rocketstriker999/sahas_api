const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const logger = require("../libs/logger");
const { readConfig } = require("../libs/config");
const { get } = require("../libs/cacher");
const { CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS } = require("../constants");
const { getPaymentGateWayPayLoadById } = require("../db/payment_gateway_payloads");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["status", "txnid"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    const { paymentGateWay: { redirectionHost } = {} } = await readConfig("app");

    //verify into payu if payment is success

    if (isRequestBodyValid) {
        const transaction = getPaymentGateWayPayLoadById({ id: validatedRequestBody.txnid });
        logger.info(transaction);

        res.redirect(redirectionHost);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
