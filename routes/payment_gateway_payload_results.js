const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { logger } = require("sahas_utils");
const { readConfig } = require("../libs/config");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["txnid"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const { paymentGateWay: { redirectionHost, postPaymentRoute } = {} } = await readConfig("app");
        res.redirect(redirectionHost.concat(postPaymentRoute.concat(validatedRequestBody.txnid)));
    }
});

module.exports = router;
