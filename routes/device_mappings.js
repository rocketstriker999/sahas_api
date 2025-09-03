const libExpress = require("express");
const logger = require("../libs/logger");

const router = libExpress.Router();

//create a new device into datbase
router.delete("/", async (req, res) => {
    logger.info("DELETE REQUEST");
    return res.status(400).json({ error: "Missing Device Information For Registration" });
});

module.exports = router;
