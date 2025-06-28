const libExpress = require("express");
const { addDevice } = require("../db/devices");

const router = libExpress.Router();

//create a new device into datbase
router.get("/create", async (req, res) => {
    if (req.headers?.device) {
        return res.status(200).json({
            device_id: await addDevice(req.headers.device),
        });
    }

    return res.status(400).json({ error: "Missing Device Information" });
});

module.exports = router;
