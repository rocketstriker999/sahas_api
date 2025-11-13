const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function getAllChapterTypes() {
    return executeSQLQueryParameterized("SELECT * FROM CHAPTER_TYPES ORDER BY view_index ASC").catch((error) => {
        logger.error(`getAllChapterTypes: ${error}`);
        return [];
    });
}

//freeze
function updateChapterTypeViewIndexById({ id, view_index }) {
    return executeSQLQueryParameterized("UPDATE CHAPTER_TYPES SET view_index=? WHERE id=?", [view_index, id]).catch((error) =>
        logger.error(`updateChapterTypeViewIndexById: ${error}`)
    );
}

//freeze
function updateChapterTypeById({ id, title, requires_class_access, requires_zoom_access, requires_recordings_access }) {
    return executeSQLQueryParameterized(
        "UPDATE CHAPTER_TYPES SET title=?,requires_class_access=?,requires_zoom_access=?,requires_recordings_access=? WHERE id=?",
        [title, requires_class_access, requires_zoom_access, requires_recordings_access, id]
    ).catch((error) => logger.error(`updateChapterTypeById: ${error}`));
}

//freeze
function addChapterType({ title, requires_class_access, requires_zoom_access, requires_recordings_access }) {
    return executeSQLQueryParameterized(
        "INSERT INTO CHAPTER_TYPES(title,requires_class_access, requires_zoom_access, requires_recordings_access) VALUES(?,?,?,?)",
        [title, requires_class_access, requires_zoom_access, requires_recordings_access]
    )
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addChapterType: ${error}`));
}

//freeze
function getChapterTypeById({ id }) {
    return executeSQLQueryParameterized("SELECT * FROM CHAPTER_TYPES WHERE id = ?", [id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getChapterTypeById: ${error}`));
}

//freeze
function deleteChapterTypeById({ id }) {
    return executeSQLQueryParameterized("DELETE FROM CHAPTER_TYPES  WHERE id=?", [id]).catch((error) => logger.error(`deleteChapterTypeById: ${error}`));
}

module.exports = { getAllChapterTypes, updateChapterTypeViewIndexById, deleteChapterTypeById, addChapterType, getChapterTypeById, updateChapterTypeById };
