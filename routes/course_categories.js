const libExpress = require("express");
const { addCourseCategory, getCourseCategoryById, deleteCourseCategoryById } = require("../db/course_categories");
const { validateRequestBody } = require("../utils");
const { getAllCourseCategories } = require("../db/course_categories");
const router = libExpress.Router();

//tested
router.get("/", async (req, res) => {
    //provide all the product categories
    res.status(200).json(await getAllCourseCategories());
});

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["title", "image"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const CourseCategoryId = await addCourseCategory(validatedRequestBody);
        if (CourseCategoryId) res.status(201).json(await getCourseCategoryById({ id: CourseCategoryId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//testing
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Course Category Id" });
    }
    //delete category
    deleteCourseCategoryById({ id: req.params.id });
    //products releated to category needs to be deleted

    //delete products
    res.sendStatus(204);
});

router.get("/:id/products", async (req, res) => {
    res.status(200).json([]);
});

module.exports = router;
