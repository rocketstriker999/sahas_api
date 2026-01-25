const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function addChapterTest({ chapter_id, timer_minutes, size, questions_pool }) {
    return executeSQLQueryParameterized(`INSERT INTO CHAPTER_TEST(chapter_id,timer_minutes,size,questions_pool) VALUES(?,?,?,?)`, [
        chapter_id,
        timer_minutes,
        size,
        questions_pool,
    ])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addChapterTest: ${error}`));
}

//freeze
function deleteChapterTest({ chapter_id }) {
    return executeSQLQueryParameterized(`DELETE FROM CHAPTER_TEST WHERE chapter_id=?`, [chapter_id]).catch((error) =>
        logger.error(`deleteChapterTest: ${error}`),
    );
}

//freeze
function getChapterTestByChapterId({ chapter_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM CHAPTER_TEST WHERE chapter_id=?`, [chapter_id]).catch((error) =>
        logger.error(`getChapterTestByChapterId: ${error}`),
    );
}

module.exports = { addChapterTest, getChapterTestByChapterId, deleteChapterTest };
