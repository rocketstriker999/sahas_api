const libExpress = require("express");

const { validateRequestBody } = require("../utils");
const { updateSubjectById, addSubject, getAllSubjects } = require("../db/subjects");
const { addCourseSubject, getCourseSubjectById } = require("../db/course_subjects");
const { getChaptersBySubjectId } = require("../db/chapters");

const router = libExpress.Router();

//tested
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "title"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        updateSubjectById(validatedRequestBody);
        res.status(200).json(validatedRequestBody);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.get("/", async (req, res) => {
    //provide all the subjects
    res.status(200).json(await getAllSubjects());
});

//tested
router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Subject id" });
    }
    //provide subject
    res.status(200).json(await getCourseSubjectById({ id: req.params.id }));
});

//tested
router.get("/:id/chapters", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Subject id" });
    }
    //provide all the subjects
    res.status(200).json(await getChaptersBySubjectId({ subject_id: req.params.id }));
});

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["title", "course_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const subjectId = await addSubject(validatedRequestBody);
        const courseSubjectId = await addCourseSubject({ course_id: validatedRequestBody.course_id, subject_id: subjectId });
        res.status(201).json(await getCourseSubjectById({ id: courseSubjectId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
