const libExpress = require("express");
const { readConfig, getConfigs } = require("../libs/config");
const logger = require("../libs/logger");
const { getAllBranches } = require("../db/branches");
const { getAllCourses } = require("../db/courses");
const router = libExpress.Router();

//Specific Config
router.get("/template", async (req, res) => {
    const { payment } = await readConfig("app");

    let config = {};
    //configs
    try {
        config = await readConfig(req.params.config);
        config.global.branches = await getAllBranches();
        config.global.courses = await getAllCourses();
        config.global.paymentTypes = payment.types;
    } catch (error) {
        logger.error(error);
    } finally {
        res.status(200).json(config);
    }
});

module.exports = router;
