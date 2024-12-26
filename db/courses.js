const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getCoursesByProductId(productId) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES WHERE product_id=?`, [productId]).catch((error) => {
        logger.error(`getCoursesByProductId: ${error}`);
        return [];
    });
}

function getCourseByProductIdAndCourseId(productId, courseId) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES WHERE id=? AND product_id=?`, [courseId, productId])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getCoursesByProductId: ${error}`);
            return [];
        });
}

module.exports = { getCoursesByProductId, getCourseByProductIdAndCourseId };
