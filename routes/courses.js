const libExpress = require("express");
const { addCourse, getCourseById, deleteCourseById, updateCourseViewIndexById, updateCourseById, getCourseByCategoryIdAndTitle } = require("../db/courses");
const { validateRequestBody } = require("../utils");
const { getEnrollmentByCourseIdAndUserId } = require("../db/enrollments");
const { getCourseSubjectsByCourseId } = require("../db/course_subjects");

const router = libExpress.Router();

//tested
router.post(
    "/",
    async (req, res, next) => {
        const requiredBodyFields = ["category_id", "title", "description", "image", "fees", "whatsapp_group", "view_index"];
        const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);
        if (!isRequestBodyValid) {
            return res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
        }
        req.body = validatedRequestBody;
        next();
    },
    async (req, res, next) => {
        if (!!(await getCourseByCategoryIdAndTitle(req.body))) {
            logger.info("Existi coruse");
            return res.status(400).json({ error: "Course Already Exist" });
        }
        next();
    },
    async (req, res) => {
        const courseId = await addCourse(req.body);
        res.status(201).json(await getCourseById({ id: courseId }));
    }
);

//tested
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Course Id" });
    }
    deleteCourseById({ id: req.params.id });
    res.sendStatus(204);
});

//tested
router.patch("/view_indexes", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(updateCourseViewIndexById);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Courses" });
});

//tested
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "title", "description", "image", "fees", "whatsapp_group"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        updateCourseById(validatedRequestBody);
        res.status(200).json(validatedRequestBody);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Course Id" });
    }

    const course = await getCourseById({ id: req.params.id });

    if (course) {
        course.enrollment = await getEnrollmentByCourseIdAndUserId({ course_id: course?.id, user_id: req?.user?.id });
        course.subjects = await getCourseSubjectsByCourseId({ course_id: req.params.id });
        return res.status(200).json(course);
    }

    res.status(400).json({ error: "Course Not Exist" });
});

module.exports = router;
