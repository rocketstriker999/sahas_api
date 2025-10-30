const libExpress = require("express");
const { validateRequestBody, verifyPaymentGatewayPayLoadStatus } = require("../utils");
const logger = require("../libs/logger");
const { readConfig } = require("../libs/config");
const { getPaymentGateWayPayLoadById } = require("../db/payment_gateway_payloads");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["status", "txnid"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    const { paymentGateWay: { redirectionHost, postVerificationRoute } = {} } = await readConfig("app");

    if (
        isRequestBodyValid &&
        (paymentGatewayPayLoad = getPaymentGateWayPayLoadById({ id: validatedRequestBody.txnid })) &&
        (await verifyPaymentGatewayPayLoadStatus(paymentGatewayPayLoad))
    ) {
        //insert into enrollment transcations
        logger.success("Verified");
    }
    res.redirect(redirectionHost.concat(postVerificationRoute.replace("?", paymentGatewayPayLoad?.course?.id)));
});

module.exports = router;
