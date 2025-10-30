const libExpress = require("express");
const { validateRequestBody, verifyPaymentGatewayPayLoadStatus } = require("../utils");
const logger = require("../libs/logger");
const { readConfig } = require("../libs/config");
const { getPaymentGateWayPayLoadById } = require("../db/payment_gateway_payloads");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["status", "txnid"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    const { paymentGateWay: { redirectionHost } = {} } = await readConfig("app");

    //verify into payu if payment is success

    if (isRequestBodyValid) {
        const paymentGatewayPayLoad = getPaymentGateWayPayLoadById({ id: validatedRequestBody.txnid });

        await verifyPaymentGatewayPayLoadStatus(paymentGatewayPayLoad);

        res.redirect(redirectionHost);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
