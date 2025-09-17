const { executeSQLQueryParameterized, executeSQLQueryRaw } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getAllCourses() {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES`).catch((error) => {
        logger.error(`getAllCourses: ${error}`);
        return [];
    });
}

//freeze
function getCoursesByCategoryId({ category_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES WHERE category_id=?`, [category_id]).catch((error) => {
        logger.error(`getCoursesByCategoryId: ${error}`);
        return [];
    });
}

//freeze
function addCourse({ category_id, title, description, image, fees, whatsapp_group }) {
    return executeSQLQueryParameterized(`INSERT INTO COURSES(category_id, title, description, image, fees, whatsapp_group) VALUES(?,?,?,?,?,?)`, [
        category_id,
        title,
        description,
        image,
        fees,
        whatsapp_group,
    ])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addCourse: ${error}`);
        });
}

//freeze
function getCourseById({ id }) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES WHERE id=?`, [id])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addCourse: ${error}`);
        });
}

module.exports = {
    getAllCourses,
    getCoursesByCategoryId,
    addCourse,
    getCourseById,
};
