const libExpress = require("express");
const { readConfig } = require("../libs/config");
const logger = require("../libs/logger");
const { getAllBranches } = require("../db/branches");
const { getAllCourses } = require("../db/courses");
const { getAllRoles } = require("../db/roles");
const { getAllAuthorities } = require("../db/authorities");
const router = libExpress.Router();

//Specific Config
router.get("/template", async (req, res) => {
    let config = {};
    //configs
    try {
        config = await readConfig("template");
        config.global.branches = await getAllBranches();
        config.global.courses = await getAllCourses();
        config.global.roles = await getAllRoles();
        config.global.authorities = await getAllAuthorities();
    } catch (error) {
        logger.error(error);
    } finally {
        res.status(200).json(config);
    }
});

module.exports = router;
