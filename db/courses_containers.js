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
    return executeSQLQueryParameterized(`INSERT INTO COURSES_CONTAINERS(category_id, title,  image, fees, view_index) VALUES(?,?,?,?,?)`, [
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

//freeze
function updateCoursesContainerViewIndexById({ id, view_index }) {
    return executeSQLQueryParameterized("UPDATE COURSES_CONTAINERS SET view_index=? WHERE id=?", [view_index, id]).catch((error) =>
        logger.error(`updateCourseViewIndexById: ${error}`)
    );
}

//freeze
function updateCoursesContainerById({ id, title, image, fees }) {
    return executeSQLQueryParameterized("UPDATE COURSES_CONTAINERS SET title=?,image=?,fees=? WHERE id=?", [title, image, fees, id]).catch((error) =>
        logger.error(`updateCourseById: ${error}`)
    );
}

//freeze
function deleteCoursesContanerById({ id }) {
    return executeSQLQueryParameterized(`DELETE FROM COURSES_CONTAINERS WHERE id=?`, [id]).catch((error) => {
        logger.error(`deleteCourseById: ${error}`);
    });
}

module.exports = {
    getCoursesContainersByCategoryId,
    getCoursesContainerByCategoryIdAndTitle,
    addCoursesContainer,
    getCoursesContainerById,
    updateCoursesContainerViewIndexById,
    updateCoursesContainerById,
    deleteCoursesContanerById,
};
