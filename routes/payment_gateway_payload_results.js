const libExpress = require("express");
const { validateRequestBody, verifyPaymentGatewayPayLoadStatus } = require("../utils");
const logger = require("../libs/logger");
const { readConfig } = require("../libs/config");
const { getPaymentGateWayPayLoadById } = require("../db/payment_gateway_payloads");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["txnid"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        logger.success("Verified");

        const { paymentGateWay: { redirectionHost, postVerificationRoute } = {} } = await readConfig("app");
        res.redirect(redirectionHost.concat(postVerificationRoute.concat(`id=${validatedRequestBody.txnid}`)));
    }
});

module.exports = router;

//  &&
//         (paymentGatewayPayLoad = getPaymentGateWayPayLoadById({ id: validatedRequestBody.txnid })) &&
//         (await verifyPaymentGatewayPayLoadStatus(paymentGatewayPayLoad))
