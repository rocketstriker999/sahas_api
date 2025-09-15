const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getAllCourseCategories() {
    return executeSQLQueryParameterized(`SELECT COURSE_CATEGORIES.*, COUNT(COURSES.id) AS courses_count FROM COURSE_CATEGORIES LEFT JOIN COURSES ON COURSES.category_id = COURSE_CATEGORIES.id GROUP BY COURSE_CATEGORIES.id ORDER BY COURSE_CATEGORIES.view_index;
`).catch((error) => logger.error(`getAllCourseCategories: ${error}`));
}

//freeze
function getCourseCategoryById({ id }) {
    return executeSQLQueryParameterized(
        `SELECT COURSE_CATEGORIES.*, COUNT(COURSES.id) AS courses_count FROM COURSE_CATEGORIES LEFT JOIN COURSES ON COURSES.category_id = COURSE_CATEGORIES.id WHERE COURSE_CATEGORIES.id = ? GROUP BY COURSE_CATEGORIES.id ORDER BY COURSE_CATEGORIES.view_index`,
        [id]
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getCourseCategoryById: ${error}`));
}

//freeze
function addCourseCategory({ title, image }) {
    return executeSQLQueryParameterized(`INSERT INTO COURSE_CATEGORIES(title,image) VALUES(?,?)`, [title, image])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addCourseCategory: ${error}`));
}

//freeze
function deleteCourseCategoryById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM COURSE_CATEGORIES WHERE id=?", [id]).catch((error) => {
        logger.error(`deleteCourseCategoryById: ${error}`);
    });
}

module.exports = { getAllCourseCategories, addCourseCategory, getCourseCategoryById, deleteCourseCategoryById };
