const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const logger = require("../libs/logger");
const { readConfig } = require("../libs/config");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["status"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    const { paymentGateWay: { redirectionHost } = {} } = await readConfig("app");

    //verify into payu if payment is success

    logger.info(JSON.stringify(validatedRequestBody));

    if (isRequestBodyValid) {
        res.redirect(redirectionHost);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
