const libExpress = require("express");
const { readConfig, getConfigs } = require("../libs/config");
const logger = require("../libs/logger");
const router = libExpress.Router();

//Specific Config
router.get("/:config", async (req, res) => {
    try {
        res.status(200).json(await readConfig(req.params.config));
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Config Not Found" });
    }
});

module.exports = router;
