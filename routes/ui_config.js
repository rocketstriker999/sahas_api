const libExpress = require("express");
const { executeSQLQueryRaw } = require("../libs/db");
const { readConfig } = require("../libs/config");
const logger = require("../libs/logger");
const router = libExpress.Router();

//NAVBR WIDGET
router.get("/navbar", async (req, res) => {
    try {
        const navbarConfig = await readConfig("navbar");
        const product_categories = await executeSQLQueryRaw("SELECT * FROM PRODUCT_CATEGORIES");
        res.status(200).json({ ...navbarConfig, product_categories });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error });
    }
});

//Carousel WIDGET
router.get("/carousel", async (req, res) => {
    try {
        const carouselConfig = await readConfig("carousel");
        res.status(200).json(carouselConfig);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error });
    }
});

//FOOTER WIDGET
router.get("/footer", async (req, res) => {
    try {
        const footerConfig = await readConfig("footer");
        res.status(200).json(footerConfig);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error });
    }
});

module.exports = router;
