const libExpress = require("express");
const { executeSQLQueryRaw } = require("../libs/db");
const { readConfig } = require("../libs/config");
const logger = require("../libs/logger");
const router = libExpress.Router();

//NAVBR WIDGET
router.get("/navbar", async (req, res) => {
    try {
        const config = await readConfig("navbar");
        const categories = await executeSQLQueryRaw("SELECT * FROM CATEGORIES");
        res.status(200).json({ ...config, categories });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error });
    }
});

//Carousel WIDGET
router.get("/carousel", async (req, res) => {
    try {
        const config = await readConfig("carousel");
        res.status(200).json(config);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error });
    }
});

//FOOTER WIDGET
router.get("/footer", async (req, res) => {
    try {
        const config = await readConfig("footer");
        res.status(200).json(config);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error });
    }
});

module.exports = router;
