const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getAllCourses() {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES ORDER BY view_index ASC`).catch((error) => {
        logger.error(`getAllCourses: ${error}`);
        return [];
    });
}

//freeze
function getCoursesByCategoryId({ category_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES WHERE category_id=? ORDER BY view_index ASC`, [category_id]).catch((error) => {
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
    d;

    return executeSQLQueryParameterized(`SELECT * FROM COURSES WHERE id=?`, [id])
        .then((result) => (result?.length ? result[0] : false))
        .catch((error) => {
            logger.error(`getCourseById: ${error}`);
        });
}

//freeze
function deleteCourseById({ id }) {
    return executeSQLQueryParameterized(`DELETE FROM COURSES WHERE id=?`, [id]).catch((error) => {
        logger.error(`deleteCourseById: ${error}`);
    });
}

//freeze
function updateCourseViewIndexById({ id, view_index }) {
    return executeSQLQueryParameterized("UPDATE COURSES SET view_index=? WHERE id=?", [view_index, id]).catch((error) =>
        logger.error(`updateCourseViewIndexById: ${error}`)
    );
}

//freeze
function updateCourseById({ id, title, description, image, fees, whatsapp_group }) {
    return executeSQLQueryParameterized("UPDATE COURSES SET title=?,description=?,image=?,fees=?,whatsapp_group=? WHERE id=?", [
        title,
        description,
        image,
        fees,
        whatsapp_group,
        id,
    ]).catch((error) => logger.error(`updateCourse: ${error}`));
}

module.exports = {
    getAllCourses,
    getCoursesByCategoryId,
    addCourse,
    getCourseById,
    deleteCourseById,
    updateCourseViewIndexById,
    updateCourseById,
};
