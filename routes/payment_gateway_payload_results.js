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

        const { paymentGateWay: { redirectionHost, postPaymentRoute } = {} } = await readConfig("app");
        res.redirect(redirectionHost.concat(postPaymentRoute.concat(validatedRequestBody.txnid)));
    }
});

router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Payment GateWay PayLoad Id" });
    }

    res.status(200).json({ status: "done" });
});

module.exports = router;

//  &&
//         (paymentGatewayPayLoad = getPaymentGateWayPayLoadById({ id: validatedRequestBody.txnid })) &&
//         (await verifyPaymentGatewayPayLoadStatus(paymentGatewayPayLoad))
