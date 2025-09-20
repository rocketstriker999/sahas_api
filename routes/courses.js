const libExpress = require("express");
const { addCourse, getCourseById, deleteCourseById } = require("../db/courses");
const { validateRequestBody } = require("../utils");

const router = libExpress.Router();

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["category_id", "title", "description", "image", "fees", "whatsapp_group"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const courseId = await addCourse(validatedRequestBody);
        courseId ? res.status(201).json(await getCourseById({ id: CourseCategoryId })) : res.status(400).json({ error: "Failed To Create Course" });
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Course Id" });
    }
    deleteCourseById({ id: req.params.id });
    res.sendStatus(204);
});

module.exports = router;
