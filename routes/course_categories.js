const libExpress = require("express");
const { addCourseCategory, getCourseCategoryById, deleteCourseCategoryById, updateCourseCategoryViewIndexById } = require("../db/course_categories");
const { validateRequestBody } = require("../utils");
const { getAllCourseCategories } = require("../db/course_categories");
const { getCoursesByCategoryId } = require("../db/courses");
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

//tested
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Course Category Id" });
    }
    //delete category
    deleteCourseCategoryById({ id: req.params.id });
    //courses releated to category needs to be deleted

    res.sendStatus(204);
});

//tested
router.patch("/view_indexes", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach((courseCategory) => updateCourseCategoryViewIndexById(courseCategory));
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Course Categories" });
});

//tested
router.get("/:id/courses", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Course Category Id" });
    }

    res.status(200).json(await getCoursesByCategoryId({ category_id: req.params.id }));
});

module.exports = router;
