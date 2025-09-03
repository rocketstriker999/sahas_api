const libExpress = require("express");
const logger = require("../libs/logger");
const { getUserByEmail, getUserIdByEmail } = require("../db/users");
const { deleteUserDeviceMappings } = require("../db/devices");

const router = libExpress.Router();

//create a new device into datbase
router.delete("/", async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: "Missing Email" });
    }

    logger.info(`Resetting Device Mapping For  - ${email}`);

    deleteUserDeviceMappings(email);

    res.sendStatus(204);
});

module.exports = router;
