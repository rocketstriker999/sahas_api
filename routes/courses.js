const { addCourse, getCourseById } = require("../db/courses");
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

module.exports = router;
