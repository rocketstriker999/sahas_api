const { executeSQLQueryParameterized, executeSQLQueryRaw } = require("../libs/db");
const logger = require("../libs/logger");

function getAllCourses() {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES`).catch((error) => {
        logger.error(`getAllCourses: ${error}`);
        return [];
    });
}

function getCoursesByCategoryId({ category_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES WHERE category_id=?`, [category_id]).catch((error) => {
        logger.error(`getCoursesByCategoryId: ${error}`);
        return [];
    });
}

module.exports = {
    getAllCourses,
    getCoursesByCategoryId,
};
