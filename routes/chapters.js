const libExpress = require("express");

const { validateRequestBody } = require("../utils");
const { updateSubjectById, addSubject, getAllSubjects } = require("../db/subjects");
const { addCourseSubject, getCourseSubjectById } = require("../db/course_subjects");
const { getChaptersBySubjectId, addChapter, getChapterById, updateChapterViewIndexById, deleteChapterById, updateChapterById } = require("../db/chapters");

const router = libExpress.Router();

//tested
// router.patch("/", async (req, res) => {
//     const requiredBodyFields = ["id", "title"];

//     const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

//     if (isRequestBodyValid) {
//         updateSubjectById(validatedRequestBody);
//         res.status(200).json(validatedRequestBody);
//     } else {
//         res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
//     }
// });

// //tested
// router.get("/", async (req, res) => {
//     //provide all the subjects
//     res.status(200).json(await getAllSubjects());
// });

// //tested
// router.get("/:id/chapters", async (req, res) => {
//     if (!req.params.id) {
//         return res.status(400).json({ error: "Missing Subject id" });
//     }
//     //provide all the subjects
//     res.status(200).json(await getChaptersBySubjectId({ subject_id: req.params.id }));
// });

//tested
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Chapter Id" });
    }
    deleteChapterById({ id: req.params.id });
    res.sendStatus(204);
});

//tested
router.patch("/view_indexes", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(updateChapterViewIndexById);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Chapters" });
});

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["title", "subject_id", "type"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const chapterId = await addChapter(validatedRequestBody);
        res.status(201).json(await getChapterById({ id: chapterId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "title", "type"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateChapterById(validatedRequestBody);
        res.status(200).json(await getChapterById({ id: validatedRequestBody.id }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
