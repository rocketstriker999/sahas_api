const libExpress = require("express");
const { executeSQLQueryRaw, executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

const router = libExpress.Router();

router.post("/subjects", async (req, res) => {
    //truncate subjects
    await executeSQLQueryRaw("TRUNCATE TABLE SUBJECTS");
    await executeSQLQueryRaw("TRUNCATE TABLE MAPPING_COURSE_SUBJECTS");

    if (req.body) {
        const subjectsInsertionPromises = [];
        const coursesToSubjectMappingPromises = [];

        req.body.forEach((element) => {
            subjectsInsertionPromises.push(executeSQLQueryParameterized("INSERT INTO SUBJECTS(id,title) VALUES (?,?)", [element.subject_id, element.title]));
            coursesToSubjectMappingPromises.push(
                executeSQLQueryParameterized("INSERT INTO MAPPING_COURSE_SUBJECTS(course_id,subject_id) VALUES (?,?)", [element.couse_id, element.subject_id])
            );
        });

        coursesToSubjectMappingPromises.push(
            executeSQLQueryParameterized(`INSERT INTO MAPPING_COURSE_SUBJECTS (course_id, subject_id)
                SELECT 8, subject_id FROM MAPPING_COURSE_SUBJECTS WHERE course_id in(6,7)`)
        );
        coursesToSubjectMappingPromises.push(
            executeSQLQueryParameterized(`INSERT INTO MAPPING_COURSE_SUBJECTS (course_id, subject_id)
                SELECT 9, subject_id FROM MAPPING_COURSE_SUBJECTS WHERE course_id in(10,11)`)
        );
        coursesToSubjectMappingPromises.push(
            executeSQLQueryParameterized(`INSERT INTO MAPPING_COURSE_SUBJECTS (course_id, subject_id)
                SELECT 12, subject_id FROM MAPPING_COURSE_SUBJECTS WHERE course_id in(13,14)`)
        );

        Promise.all([...subjectsInsertionPromises, ...coursesToSubjectMappingPromises, ,])
            .then((results) => res.status(200).json({ msg: "Subjects Synced" }))
            .catch((error) => {
                logger.error(error);
                res.status(400).json({ msg: error });
            });
    }
});

router.post("/chapters", async (req, res) => {
    //truncate chapters

    if (req.body.is_first_request) {
        await executeSQLQueryRaw("TRUNCATE TABLE CHAPTERS");
        await executeSQLQueryRaw("TRUNCATE TABLE MAPPING_SUBJECT_CHAPTERS");
    }

    if (req.body.data) {
        const chaptersInsertionPromises = [];
        const SubjectToChaptersMappingPromises = [];

        req.body.data.forEach((element) => {
            chaptersInsertionPromises.push(executeSQLQueryParameterized("INSERT INTO CHAPTERS(id,title) VALUES (?,?)", [element.chapter_id, element.title]));
            SubjectToChaptersMappingPromises.push(
                executeSQLQueryParameterized("INSERT INTO MAPPING_SUBJECT_CHAPTERS(subject_id,chapter_id) VALUES (?,?)", [
                    element.subject_id,
                    element.chapter_id,
                ])
            );
        });

        Promise.all([...chaptersInsertionPromises, ...SubjectToChaptersMappingPromises])
            .then(() => res.status(200).json({ msg: "Chapters Synced" }))
            .catch((error) => {
                logger.error(error);
                res.status(400).json({ msg: error });
            });
    }
});

router.post("/videos", async (req, res) => {
    if (req.body.is_first_request) {
        await executeSQLQueryRaw("TRUNCATE TABLE CONTENT_VIDEOS");
    }

    if (req.body.data) {
        const videosInsertionPromises = [];

        req.body.data.forEach((element) => {
            videosInsertionPromises.push(
                executeSQLQueryParameterized("INSERT INTO CONTENT_VIDEOS(title, content_id, yt_id) SELECT ?, content_id, ? FROM CHAPTERS WHERE id = ?", [
                    element.title,
                    element.yt_id,
                    element.chapter_id,
                ])
            );
        });

        Promise.all(videosInsertionPromises)
            .then(() => res.status(200).json({ msg: "Videos Synced" }))
            .catch((error) => {
                logger.error(error);
                res.status(400).json({ msg: error });
            });
    }
});

router.post("/pdfs", async (req, res) => {});

router.post("/demo-videos", async (req, res) => {});

router.post("/demo-pdfs", async (req, res) => {});

module.exports = router;
