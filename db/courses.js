const { executeSQLQueryParameterized, executeSQLQueryRaw } = require("../libs/db");
const logger = require("../libs/logger");

function getAllCourses() {
    return executeSQLQueryParameterized(`SELECT * FROM CATEGORIZED_COURSES`).catch((error) => {
        logger.error(`getAllCourses: ${error}`);
        return [];
    });
}

module.exports = {
    getAllCourses,
};
