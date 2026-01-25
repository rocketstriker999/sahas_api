const libExpress = require("express");
const axios = require("axios");
const { parse } = require("csv-parse/sync");
const { validateRequestBody, logger } = require("sahas_utils");
const { getSubjectById } = require("../db/subjects");
const {
    addChapter,
    getChapterById,
    updateChapterViewIndexById,
    deleteChapterById,
    updateChapterById,
    getChapterBySubjectIdAndTitle,
} = require("../db/chapters");
const { getMediaByChapterId } = require("../db/media");

const router = libExpress.Router();

// //tested
router.get("/:id/media", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Chapter id" });
    }

    //check if chapter is required enrollment or not

    //if it does not require enrollment fethc media

    //if it requires enrollment and no enrollment access is there then let is pass

    //provide all the subjects
    res.status(200).json(await getMediaByChapterId({ chapter_id: req.params.id }));
});

//tested
router.get("/test", async (req, res) => {
    if (!req.query?.chapters?.length || !req.query?.subject) {
        return res.status(400).json({ error: "Missing Chapters or Subject" });
    }

    const { test_timer_minutes, test_size } = await getSubjectById({ id: req.query.subject });

    const testQuestions = [];

    logger.info(JSON.stringify(req.query));

    for (const chapterId of req.query?.chapters) {
        const chapter = await getChapterById({ id: chapterId });
        logger.info(JSON.stringify(chapter));
        const response = await axios.get(chapter.test_questions_pool);
        const records = parse(response.data, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
        testQuestions.push(...records);
    }

    res.status(200).json({
        timerMinute: test_timer_minutes,
        questions: testQuestions?.sort(() => 0.5 - Math.random())?.slice(0, test_size),
    });
});

//tested
router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Chapter Id" });
    }

    const chapter = await getChapterById({ id: req.params.id });
    chapter.subject = await getSubjectById({ id: chapter?.subject_id });

    res.status(200).json(chapter);
});

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
router.post(
    "/",
    async (req, res, next) => {
        const requiredBodyFields = ["title", "subject_id", "type", "view_index"];
        const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);
        if (!isRequestBodyValid) {
            return res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
        }
        req.body = validatedRequestBody;
        next();
    },
    async (req, res, next) => {
        if (!!(await getChapterBySubjectIdAndTitle(req.body))) {
            return res.status(400).json({ error: "Chapter Already Exist" });
        }
        next();
    },
    async (req, res) => {
        const chapterId = await addChapter(req.body);
        res.status(201).json(await getChapterById({ id: chapterId }));
    },
);

//tested
router.patch(
    "/",
    async (req, res, next) => {
        const requiredBodyFields = ["id", "title", "type"];
        const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);
        if (!isRequestBodyValid) {
            return res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
        }
        req.body = validatedRequestBody;
        next();
    },
    async (req, res) => {
        await updateChapterById(req.body);
        res.status(200).json(await getChapterById({ id: req.body.id }));
    },
);

module.exports = router;
