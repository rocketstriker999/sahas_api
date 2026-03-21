const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//tested
function addUserHistory({ user_id, institute = null, course = null, refered_by = null }) {
    return executeSQLQueryParameterized(`INSERT  INTO USER_HISTORY(user_id,institute, course, refered_by) VALUES(?,?,?,?)`, [
        user_id,
        institute,
        course,
        refered_by,
    ]).catch((error) => logger.error(`addUserHistory: ${error}`));
}

function getUserHistoryById({ user_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM USER_HISTORY WHERE user_id=?`, [user_id])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getUserHistoryById: ${error}`));
}

module.exports = {
    addUserHistory,
    getUserHistoryById,
};
