const libExpress = require("express");
const { addDevice } = require("../db/devices");
const logger = require("../libs/logger");

const router = libExpress.Router();

//create a new device into datbase
router.post("/create", async (req, res) => {
    if (!Boolean(req.headers?.device_id) && req.body.device) {
        return res.status(201).json({
            device_id: await addDevice(req.body),
        });
    }

    return res.status(400).json({ error: "Missing Device Information" });
});

module.exports = router;
