const libExpress = require("express");
const { readConfig, writeConfig } = require("../libs/config");
const logger = require("../libs/logger");
const { getAllBranches } = require("../db/branches");
const { getAllCourses } = require("../db/courses");
const { getAllRoles } = require("../db/roles");
const { getAllAuthorities } = require("../db/authorities");
const { validateRequestBody } = require("../utils");
const router = libExpress.Router();
const { v4: uuidv4 } = require("uuid");

//Template Config
router.get("/", async (req, res) => {
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

router.post("/dashboard/carousel-images", async (req, res) => {
    const requiredBodyFields = ["click_link", "source"];

    try {
        const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);
        if (isRequestBodyValid) {
            const config = await readConfig("template");
            config.dash_board.carousel_images = [...config.dash_board.carousel_images, validatedRequestBody];
            writeConfig("template", config);
            res.sendStatus(201);
        } else {
            throw new Error(`Missing ${missingRequestBodyFields?.join(",")}`);
        }
    } catch (error) {
        logger.error(error);
        res.status(400).json({ error });
    }
});

router.delete("/dashboard/carousel-images/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Carousel Image Id" });
    }

    try {
        const config = await readConfig("template");
        config.dash_board.carousel_images = config?.dash_board?.carousel_images?.filter((carouselImage) => carouselImage?.id !== req.params.id);
        writeConfig("template", config);
        res.sendStatus(204);
    } catch (error) {
        logger.error(error);
        res.status(400).json({ error });
    }
});

module.exports = router;
