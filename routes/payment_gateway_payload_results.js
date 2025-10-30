const libExpress = require("express");
const { getCourseById } = require("../db/courses");
const { validateRequestBody } = require("../utils");
const libCrypto = require("crypto");
const { readConfig } = require("../libs/config");
const { addPaymentGateWayPayLoad } = require("../db/payment_gateway_payloads");
const logger = require("../libs/logger");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["status"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    //verify into payu if payment is success

    logger.info(JSON.stringify(req));

    if (isRequestBodyValid) {
        res.redirect("http://localhost:3000/");
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
