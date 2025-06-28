const libExpress = require("express");
const { addDevice } = require("../db/devices");
const logger = require("../libs/logger");

const router = libExpress.Router();

//create a new device into datbase
router.post("/create", async (req, res) => {
    logger.info(!Boolean(req.headers?.device_id));
    logger.info(JSON.stringify(req.body));

    return res.status(201).json({
        device_id: "1234",
    });

    if (!Boolean(req.headers?.device_id) && req.body.os && req.body.os && req.body.browser) {
        return res.status(201).json({
            device_id: await addDevice(req.body),
        });
    }

    return res.status(400).json({ error: "Missing Device Information" });
});

module.exports = router;
