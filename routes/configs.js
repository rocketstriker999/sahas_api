const libExpress = require("express");
const { readConfig } = require("../libs/config");
const logger = require("../libs/logger");
const { getAllBranches } = require("../db/branches");
const { getAllCourses } = require("../db/courses");
const router = libExpress.Router();

//Specific Config
router.get("/template", async (req, res) => {
    let config = {};
    //configs
    try {
        config = await readConfig("template");
        config.global.branches = await getAllBranches();
        config.global.courses = await getAllCourses();
    } catch (error) {
        logger.error(error);
    } finally {
        res.status(200).json(config);
    }
});

module.exports = router;
