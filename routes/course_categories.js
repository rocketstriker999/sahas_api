const libExpress = require("express");
const {
    addCourseCategory,
    getCourseCategoryById,
    deleteCourseCategoryById,
    updateCourseCategoryViewIndexById,
    getCourseCategoryByTitle,
} = require("../db/course_categories");
const { validateRequestBody } = require("../utils");
const { getAllCourseCategories } = require("../db/course_categories");
const { getCoursesByCategoryId } = require("../db/courses");
const { logger } = require("sahas_utils");

const router = libExpress.Router();

//tested
router.get("/", async (req, res) => {
    //provide all the product categories
    res.status(200).json(await getAllCourseCategories());
});

//tested
router.post(
    "/",
    async (req, res, next) => {
        const requiredBodyFields = ["title", "image", "view_index"];
        const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);
        if (!isRequestBodyValid) {
            res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
        }
        req.body = validatedRequestBody;
        next();
    },
    async (req, res, next) => {
        if (!!(await getCourseCategoryByTitle({ title: req.body.title }))) {
            return res.status(400).json({ error: "Course Category Already Exist" });
        }
        next();
    },
    async (req, res) => {
        const CourseCategoryId = await addCourseCategory(req.body);
        res.status(201).json(await getCourseCategoryById({ id: CourseCategoryId }));
    }
);

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
        req.body.forEach(updateCourseCategoryViewIndexById);
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
