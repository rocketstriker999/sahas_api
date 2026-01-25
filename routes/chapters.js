const libExpress = require("express");
const axios = require("axios");
const { parse } = require("csv-parse/sync");
const { validateRequestBody } = require("sahas_utils");
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
const {
    addChapterTest,
    getChapterTestByChapterId,
    deleteChapterTest,
    addTestConfiguration,
    getTestConfigurationById,
    updateTestConfigurationById,
    getTestConfigurationByChapterId,
} = require("../db/test_configurations");

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
router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Chapter Id" });
    }

    const chapter = await getChapterById({ id: req.params.id });
    chapter.subject = await getSubjectById({ id: chapter?.subject_id });

    res.status(200).json(chapter);
});

//tested
router.get("/:id/quiz", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Chapter Id" });
    }

    const chapter = await getChapterById({ id: req.params.id });

    if (!chapter) {
        return res.status(400).json({ error: "Chapter not found" });
    }

    if (!chapter?.quiz_attainable && !chapter?.quiz_pool) {
        return res.status(400).json({ error: "Quiz Not Allowed !" });
    }

    const response = await axios.get(chapter.quiz_pool);

    const records = parse(response.data, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    const shuffled = records.sort(() => 0.5 - Math.random());
    const limit = chapter?.quiz_questions || 5;
    const selectedQuestions = shuffled.slice(0, limit);

    const quizResponse = {
        quiz_time: chapter?.quiz_time || 10,
        quiz_pool: selectedQuestions,
    };

    res.status(200).json(quizResponse);
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
        if (req.body?.test_attainable && req.body?.testConfiguration) {
            req.body.test_configuration_id = await addTestConfiguration(req.body?.testConfiguration);
        }
        const chapterId = await addChapter(req.body);
        const chapter = await getChapterById({ id: chapterId });
        if (chapter?.test_attainable) {
            chapter.testConfiguration = await getTestConfigurationByChapterId({ chapter_id: chapterId });
        }
        res.status(201).json(chapter);
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
        if (req.body?.testConfiguration) {
            if (req.body?.testConfiguration?.id) {
                await updateTestConfigurationById(req.body?.testConfiguration);
            } else {
                req.body.test_configuration_id = await addTestConfiguration(req.body?.testConfiguration);
            }
        }
        await updateChapterById(req.body);
        const chapter = await getChapterById({ id: req.body.id });
        if (chapter?.test_attainable) {
            chapter.testConfiguration = await getTestConfigurationByChapterId({ chapter_id: req.body.id });
        }

        res.status(200).json(chapter);
    },
);

module.exports = router;
