const libExpress = require("express");
const { executeSQLQueryRaw } = require("../libs/db");
const { readConfig, getConfigs } = require("../libs/config");
const logger = require("../libs/logger");
const router = libExpress.Router();

//All Configs
router.get("/template", async (req, res) => {
    try {
        let allConfigs = {};
        const configs = await getConfigs();
        console.log(configs);
        for await (config of configs) {
            allConfigs = { ...allConfigs, ...(await readConfig(config)) };
        }
        res.status(200).json(allConfigs);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Erro While Parsing Configs" });
    }
});

//Specifig Config
router.get("/:config", async (req, res) => {
    try {
        const config = await readConfig(`${req.params.config}.json`);
        res.status(200).json(config[req.params.config]);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: "Config Not Found" });
    }
});

module.exports = router;
