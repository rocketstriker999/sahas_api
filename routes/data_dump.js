const libExpress = require("express");
const { executeSQLQueryRaw, executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

const router = libExpress.Router();

router.post("/subjects", async (req, res) => {
    // const CourseMapping = {
    //     "11th Commerce Eng Med (GSEB)": 1,
    //     "12th Commerce Eng Med (GSEB)": 2,
    //     "CS Executive Module 1": 3,
    //     "CS Executive Module 2": 4,
    //     "CSEET [ C.S. 1st Level ]": 5,
    //     "F.Y.B.Com Sem 2": 6,
    //     "First Year Bcom Sem1": 7,
    //     "FYB.Com Sem 1 & 2": 8,
    //     "S.Y.B.Com Sem 3 & 4": 9,
    //     "Second Year B.Com Sem 4 [ MSU ]": 10,
    //     "Second Year Bcom Sem3": 11,
    //     "T.Y.B.Com Sem 5 & 6": 12,
    //     "T.Y.Bcom (Sem 6)": 13,
    //     "Third Year Bcom Sem5": 14,
    //     "ગુજરાતીમાથી અંગ્રેજી માં રૂપાંતર Course": 15,
    //     "૧૨ કોમર્સ [ગુજરાતી માધ્યમ]": 16,
    //     "CBSE 11th Commerce": 17,
    // };

    //truncate subjects
    await executeSQLQueryRaw("TRUNCATE TABLE SUBJECTS");

    if (req.body) {
        const subjectsInsertionPromises = [];
        const coursesToSubjectMapping = [];

        req.body.forEach((element) => {
            subjectsInsertionPromises.push(executeSQLQueryParameterized("INSERT INTO SUBJECTS(id,title) VALUES (?,?)", [element.subject_id, element.title]));
            coursesToSubjectMapping.push([element.couse_id, element.subject_id]);
        });

        Promise.all(subjectsInsertionPromises)
            .then((results) => res.status(200).json({ msg: results }))
            .catch((error) => res.status(400).json({ msg: error }));
    }

    //insert into subjects
    //insert into course to subject mapping
});

router.post("/chapters", async (req, res) => {
    //truncate chapters
    //insert into chapters
    //insert into subject_chapter_mapping
});

router.post("/videos", async (req, res) => {});

router.post("/pdfs", async (req, res) => {});

module.exports = router;
