const libExpress = require("express");
const { addDevice } = require("../db/devices");

const router = libExpress.Router();

//create a new device into datbase
router.post("/create", async (req, res) => {
    console.log(!Boolean(req.headers?.device_id));

    if (!Boolean(req.headers?.device_id) && req.body.os && req.body.company && req.body.browser) {
        return res.status(201).json({
            device_id: await addDevice(req.body),
        });
    }

    return res.status(400).json({ error: "Missing Device Information" });
});

module.exports = router;
