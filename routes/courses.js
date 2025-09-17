const router = libExpress.Router();

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["category_id", "title", "description", "image", "fees", "whatsapp_group"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const CourseCategoryId = await addCourseCategory(validatedRequestBody);
        if (CourseCategoryId) res.status(201).json(await getCourseCategoryById({ id: CourseCategoryId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
