const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

function getCoursesContainersByCategoryId({ category_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES_CONTAINERS WHERE category_id=?`, [category_id]).catch((error) => {
        logger.error(`getAllBranches: ${error}`);
        return [];
    });
}

//freeze
function getCoursesContainerByCategoryIdAndTitle({ category_id, title }) {
    return executeSQLQueryParameterized(`SELECT title from COURSES_CONTAINERS WHERE category_id=? AND title=?`, [category_id, title])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getCoursesContainerByCategoryIdAndTitle: ${error}`));
}

//freeze
function addCoursesContainer({ category_id, title, image, fees, view_index }) {
    return executeSQLQueryParameterized(`INSERT INTO COURSES(category_id, title,  image, fees, view_index) VALUES(?,?,?,?,?)`, [
        category_id,
        title,
        image,
        fees,
        view_index,
    ])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addCoursesContainer: ${error}`);
        });
}

//freeze
function getCoursesContainerById({ id }) {
    return executeSQLQueryParameterized(`SELECT * FROM COURSES_CONTAINERS WHERE id=?`, [id])
        .then((result) => (result?.length ? result[0] : false))
        .catch((error) => {
            logger.error(`getCoursesContainerById: ${error}`);
        });
}

module.exports = { getCoursesContainersByCategoryId, getCoursesContainerByCategoryIdAndTitle, addCoursesContainer, getCoursesContainerById };
