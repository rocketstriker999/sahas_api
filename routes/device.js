const libExpress = require("express");
const { addDevice } = require("../db/devices");

const router = libExpress.Router();

const { v4: uuidv4 } = require("uuid");

//create a new device into datbase
router.post("/create", async (req, res) => {
    if (!Boolean(req.headers?.device_finger_print) && req.body.device) {
        return res.status(201).json({
            device_finger_print: await addDevice({ finger_print: uuidv4(), description: req.body.device }),
        });
    }

    return res.status(400).json({ error: "Missing Device Information" });
});

module.exports = router;
