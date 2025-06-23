const libExpress = require("express");
const { executeSQLQueryRaw, executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");
const { refresh } = require("./libs/cacher");

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
                executeSQLQueryParameterized("INSERT INTO MAPPING_COURSE_SUBJECTS(course_id,subject_id,view_index) VALUES (?,?,?)", [
                    element.couse_id,
                    element.subject_id,
                    element.view_index,
                ])
            );
        });

        coursesToSubjectMappingPromises.push(
            executeSQLQueryParameterized(`INSERT INTO MAPPING_COURSE_SUBJECTS (view_index,course_id, subject_id)
                SELECT 0,8, subject_id FROM MAPPING_COURSE_SUBJECTS WHERE course_id in(6,7)`)
        );
        coursesToSubjectMappingPromises.push(
            executeSQLQueryParameterized(`INSERT INTO MAPPING_COURSE_SUBJECTS (view_index,course_id, subject_id)
                SELECT 0,9, subject_id FROM MAPPING_COURSE_SUBJECTS WHERE course_id in(10,11)`)
        );
        coursesToSubjectMappingPromises.push(
            executeSQLQueryParameterized(`INSERT INTO MAPPING_COURSE_SUBJECTS (view_index,course_id, subject_id)
                SELECT 0,12, subject_id FROM MAPPING_COURSE_SUBJECTS WHERE course_id in(13,14)`)
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
                executeSQLQueryParameterized("INSERT INTO MAPPING_SUBJECT_CHAPTERS(subject_id,chapter_id,view_index) VALUES (?,?,?)", [
                    element.subject_id,
                    element.chapter_id,
                    element.view_index,
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

router.post("/chapter-media", async (req, res) => {
    if (req.body.is_first_request) {
        await executeSQLQueryRaw("TRUNCATE TABLE MEDIA");
    }

    if (req.body.data) {
        const mediaInsertionPromises = [];

        req.body.data.forEach((element) => {
            mediaInsertionPromises.push(
                executeSQLQueryParameterized(
                    "INSERT INTO MEDIA(downloadable,type,view_index,title, media_group_id, cdn_id) SELECT ?,?,?,?, media_group_id, ? FROM CHAPTERS WHERE id = ?",
                    [element.downloadable, element.type, element.view_index, element.title, element.source, element.chapter_id]
                )
            );
        });

        Promise.all(mediaInsertionPromises)
            .then(() => res.status(200).json({ msg: "Media Synced" }))
            .catch((error) => {
                logger.error(error);
                res.status(400).json({ msg: error });
            });
    }
});

router.post("/demo-media", async (req, res) => {
    if (req.body.data) {
        const mediaInsertionPromises = [];

        req.body.data.forEach((element) => {
            mediaInsertionPromises.push(
                executeSQLQueryParameterized(
                    "INSERT INTO MEDIA(downloadable,type,view_index,title, media_group_id, cdn_id) SELECT ?,?,?,?, media_group_id, ? FROM SUBJECTS WHERE id = ?",
                    [element.downloadable, element.type, element.view_index, element.title, element.source, element.subject_id]
                )
            );
        });

        Promise.all(mediaInsertionPromises)
            .then(() => res.status(200).json({ msg: "Demo Media Synced" }))
            .catch((error) => {
                logger.error(error);
                res.status(400).json({ msg: error });
            });
    }
});

router.post("/refresh-cache", async (req, res) => {
    //refreshing all cache post syncs
    refresh(process.env.CACHE_KEYS_CATEGORIES);
    refresh(process.env.CACHE_KEYS_PRODUCTS);
    refresh(process.env.CACHE_KEYS_COURSES);
    refresh(process.env.CACHE_KEYS_SUBJECTS);
    refresh(process.env.CACHE_KEYS_CHAPTERS);

    res.status(200).json({ msg: "Cache Refreshed" });
});

module.exports = router;
