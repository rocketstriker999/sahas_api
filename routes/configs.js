const libExpress = require("express");
const { readConfig, getConfigs } = require("../libs/config");
const logger = require("../libs/logger");
const { getAllBranches } = require("../db/branches");
const router = libExpress.Router();

//Specific Config
router.get("/:config", async (req, res) => {
    let config = {};

    try {
        config = await readConfig(req.params.config);
        config.global.branches = await getAllBranches();
    } catch (error) {
        logger.error(error);
    } finally {
        res.status(200).json(config);
    }
});

module.exports = router;
