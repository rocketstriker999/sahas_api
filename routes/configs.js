const libExpress = require("express");
const { readConfig, getConfigs } = require("../libs/config");
const logger = require("../libs/logger");
const router = libExpress.Router();

//Specific Config
router.get("/:config", async (req, res) => {
    let config = {};

    try {
        config = await readConfig(req.params.config);
    } catch (error) {
        logger.error(error);
    } finally {
        res.status(200).json(config);
    }
});

module.exports = router;
