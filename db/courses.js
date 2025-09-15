const { executeSQLQueryParameterized, executeSQLQueryRaw } = require("../libs/db");
const logger = require("../libs/logger");

function getAllCourses() {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES`).catch((error) => {
        logger.error(`getAllCourses: ${error}`);
        return [];
    });
}

module.exports = {
    getAllCourses,
};
