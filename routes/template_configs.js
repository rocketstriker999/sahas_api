const libExpress = require("express");
const { readConfig, writeConfig } = require("../libs/config");
const { logger } = require("sahas_utils");
const { getAllBranches } = require("../db/branches");
const { getAllCourses } = require("../db/courses");
const { getAllRoles } = require("../db/roles");
const { getAllAuthorities } = require("../db/authorities");
const { validateRequestBody } = require("sahas_utils");
const router = libExpress.Router();
const { v4: uuidv4 } = require("uuid");
const { getAllChapterTypes } = require("../db/chapter_types");

/**
 * @swagger
 * tags:
 *   name: TemplateConfig
 *   description: Template configuration management
 */

/**
 * @swagger
 * /template-configs:
 *   get:
 *     summary: Get template configuration
 *     tags: [TemplateConfig]
 *     security:
 *       - DeviceFingerPrint: []
 *       - AuthenticationToken: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.get("/", async (req, res) => {
    let config = {};
    //configs
    try {
        config = await readConfig("template");
        config.global.branches = await getAllBranches();
        config.global.courses = await getAllCourses();
        config.global.roles = await getAllRoles();
        config.global.authorities = await getAllAuthorities();
        config.global.chapter_types = await getAllChapterTypes();
    } catch (error) {
        logger.error(error);
    } finally {
        res.status(200).json(config);
    }
});

/**
 * @swagger
 * /template-configs/dashboard/carousel-images:
 *   post:
 *     summary: Add dashboard carousel image
 *     tags: [TemplateConfig]
 *     security:
 *       - DeviceFingerPrint: []
 *       - AuthenticationToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - click_link
 *               - source
 *             properties:
 *               click_link:
 *                 type: string
 *               source:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post("/dashboard/carousel-images", async (req, res) => {
    const requiredBodyFields = ["click_link", "source"];

    try {
        const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);
        if (isRequestBodyValid) {
            const config = await readConfig("template");
            validatedRequestBody.id = uuidv4();
            config.dash_board.carousel_images = [...config.dash_board.carousel_images, validatedRequestBody];
            writeConfig("template", config);
            res.status(201).json(validatedRequestBody);
        } else {
            res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
        }
    } catch (error) {
        logger.error(error);
        res.status(400).json({ error });
    }
});

/**
 * @swagger
 * /template-configs/dashboard/dialog:
 *   put:
 *     summary: Update dashboard dialog
 *     tags: [TemplateConfig]
 *     security:
 *       - DeviceFingerPrint: []
 *       - AuthenticationToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - heading
 *               - media_url
 *               - note
 *               - title
 *             properties:
 *               description:
 *                 type: string
 *               heading:
 *                 type: string
 *               media_url:
 *                 type: string
 *               note:
 *                 type: string
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 */
router.put("/dashboard/dialog", async (req, res) => {
    const requiredBodyFields = ["description", "heading", "media_url", "note", "title"];

    try {
        const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);
        if (isRequestBodyValid) {
            const config = await readConfig("template");
            config.dash_board.dialog = validatedRequestBody;
            writeConfig("template", config);
            res.status(200).json(validatedRequestBody);
        } else {
            res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
        }
    } catch (error) {
        logger.error(error);
        res.status(400).json({ error });
    }
});

/**
 * @swagger
 * /template-configs/dashboard/carousel-images/{id}:
 *   delete:
 *     summary: Delete dashboard carousel image
 *     tags: [TemplateConfig]
 *     security:
 *       - DeviceFingerPrint: []
 *       - AuthenticationToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad Request
 */
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
