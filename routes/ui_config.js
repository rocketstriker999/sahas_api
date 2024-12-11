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

//LOGIN CONTAINER
router.get("/login", async (req, res) => {
    try {
        const loginConfig = await readConfig("login");
        res.status(200).json(loginConfig);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error });
    }
});

//DASHBOARD CONTAINER
router.get("/dashboard", async (req, res) => {
    try {
        const dashBoardConfig = await readConfig("dashboard");
        dashBoardConfig.showcase.product_categories = await executeSQLQueryRaw("SELECT * FROM PRODUCT_CATEGORIES");
        res.status(200).json(dashBoardConfig);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error });
    }
});

//ONE PERTICULAR PRODUCT SECTION
router.get("/product", async (req, res) => {
    try {
        const productConfig = await readConfig("product");
        res.status(200).json(productConfig);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error });
    }
});

//PRODUCTS Section - SEARCH
router.get("/products", async (req, res) => {
    try {
        const productsConfig = await readConfig("products");
        productsConfig.products_search.product_categories = await executeSQLQueryRaw("SELECT name FROM PRODUCT_CATEGORIES");
        res.status(200).json(productsConfig);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error });
    }
});

//DEMO Section
router.get("/demo", async (req, res) => {
    try {
        const demoConfig = await readConfig("demo");
        res.status(200).json(demoConfig);
    } catch (error) {
        logger.error(error);
        res.status(500).json({ error: error });
    }
});

module.exports = router;
