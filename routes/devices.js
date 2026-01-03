const libExpress = require("express");
const { addDevice, updateUserDeviceStatusById } = require("../db/devices");
const { logger } = require("sahas_utils");

const router = libExpress.Router();

//create a new device into datbase
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "active"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateUserDeviceStatusById(validatedRequestBody);
        res.sendStatus(400);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
