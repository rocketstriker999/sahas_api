const libExpress = require("express");
const { addDevice } = require("../db/devices");
const { logger } = require("sahas_utils");

const router = libExpress.Router();

//create a new device into datbase
router.post("/ledger", async (req, res) => {
    logger.info(JSON.stringify(req.body));
    return res.status(200).json({ msg: "done" });
});

module.exports = router;
