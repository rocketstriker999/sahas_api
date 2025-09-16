const libExpress = require("express");
const { addCourseCategory, getCourseCategoryById, deleteCourseCategoryById, updateCourseCategoryViewIndexById } = require("../db/course_categories");
const { validateRequestBody } = require("../utils");
const { getAllCourseCategories } = require("../db/course_categories");
const { error } = require("../libs/logger");
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
    //courses releated to category needs to be deleted

    res.sendStatus(204);
});

//testing
router.patch("/view_indexes", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach((courseCategory) => updateCourseCategoryViewIndexById(courseCategory));
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Course Categories" });
});

router.get("/:id/products", async (req, res) => {
    res.status(200).json([]);
});

module.exports = router;
