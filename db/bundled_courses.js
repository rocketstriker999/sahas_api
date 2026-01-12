const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function addBundledCourse({ course_id, bundled_course_id }) {
    return executeSQLQueryParameterized("INSERT INTO BUNDLED_COURSES(course_id,bundled_course_id) VALUES(?,?)", [course_id, bundled_course_id]).catch(
        (error) => {
            logger.error(`addBundledCourse: ${error}`);
        }
    );
}

function removeBundledCoursesByCourseId({ course_id }) {
    return executeSQLQueryParameterized("DELETE FROM BUNDLED_COURSES WHERE course_id=?", [course_id]).catch((error) => {
        logger.error(`removeBundledCoursesByCourseId: ${error}`);
    });
}

module.exports = { addBundledCourse, removeBundledCoursesByCourseId };
