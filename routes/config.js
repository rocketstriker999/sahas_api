const libExpress = require("express");
const { executeSQLQueryRaw } = require("../libs/db");
const { readConfig } = require("../libs/config");
const logger = require("../libs/logger");
const router = libExpress.Router();

//NAVBR WIDGET
router.get("/:config", async (req, res) => {
    try {
        const config = await readConfig(req.params.config);
        res.status(200).json(config);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Config Not Found" });
    }
});

module.exports = router;
