const libExpress = require("express");
const {
    addCourseCategory,
    getCourseCategoryById,
    deleteCourseCategoryById,
    updateCourseCategoryViewIndexById,
    getCourseCategoryByTitle,
} = require("../db/course_categories");
const { validateRequestBody } = require("sahas_utils");
const { getAllCourseCategories } = require("../db/course_categories");
const { getCoursesByCategoryId } = require("../db/courses");
const { logger } = require("sahas_utils");
const { getBundledCoursesByCourseId } = require("../db/bundled_courses");
const requires_authority = require("../middlewares/requires_authority");
const { AUTHORITIES } = require("../constants");

const router = libExpress.Router();

/**
 * @swagger
 * tags:
 *   name: CourseCategories
 *   description: Course category management
 */

/**
 * @swagger
 * /course-categories:
 *   get:
 *     summary: Get all course categories
 *     tags: [CourseCategories]
 *     security:
 *       - DeviceFingerPrint: []
 *       - AuthenticationToken: []
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", requires_authority(AUTHORITIES.READ_COURSE_CATEGORY), async (req, res) => {
    //provide all the product categories
    res.status(200).json(await getAllCourseCategories());
});

/**
 * @swagger
 * /course-categories:
 *   post:
 *     summary: Create a new course category
 *     tags: [CourseCategories]
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
 *               - title
 *               - image
 *               - view_index
 *             properties:
 *               title:
 *                 type: string
 *               image:
 *                 type: string
 *               view_index:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post(
    "/",
    requires_authority(AUTHORITIES.CREATE_COURSE_CATEGORY),
    async (req, res, next) => {
        const requiredBodyFields = ["title", "image", "view_index"];
        const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);
        if (!isRequestBodyValid) {
            return res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
        }
        req.body = validatedRequestBody;
        next();
    },
    async (req, res, next) => {
        if (!!(await getCourseCategoryByTitle(req.body))) {
            return res.status(400).json({ error: "Course Category Already Exist" });
        }
        next();
    },
    async (req, res) => {
        const CourseCategoryId = await addCourseCategory(req.body);
        res.status(201).json(await getCourseCategoryById({ id: CourseCategoryId }));
    }
);

/**
 * @swagger
 * /course-categories/{id}:
 *   delete:
 *     summary: Delete a course category
 *     tags: [CourseCategories]
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
router.delete("/:id", requires_authority(AUTHORITIES.DELETE_COURSE_CATEGORY), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Course Category Id" });
    }
    //delete category
    deleteCourseCategoryById({ id: req.params.id });
    //courses releated to category needs to be deleted
    res.sendStatus(204);
});

/**
 * @swagger
 * /course-categories/view_indexes:
 *   patch:
 *     summary: Update view indexes for multiple course categories
 *     tags: [CourseCategories]
 *     security:
 *       - DeviceFingerPrint: []
 *       - AuthenticationToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - id
 *                 - view_index
 *               properties:
 *                 id:
 *                   type: string
 *                 view_index:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 */
router.patch("/view_indexes", requires_authority(AUTHORITIES.UPDATE_COURSE_CATEGORY_VIEW_INDEX), async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(updateCourseCategoryViewIndexById);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Course Categories" });
});

/**
 * @swagger
 * /course-categories/{id}/courses:
 *   get:
 *     summary: Get courses by category ID
 *     tags: [CourseCategories]
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
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 */
router.get("/:id/courses", requires_authority(AUTHORITIES.READ_COURSE_BY_CATEGORY), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Course Category Id" });
    }

    const courses = await getCoursesByCategoryId({ category_id: req.params.id });

    for (const course of courses) if (course?.is_bundle) course.bundledCourses = await getBundledCoursesByCourseId({ course_id: course.id });

    res.status(200).json(courses);
});

module.exports = router;
