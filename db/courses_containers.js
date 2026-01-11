const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

function getCoursesContainersByCategoryId({ category_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES_CONTAINERS WHERE category_id=?`, [category_id]).catch((error) => {
        logger.error(`getAllBranches: ${error}`);
        return [];
    });
}

module.exports = { getCoursesContainersByCategoryId };
