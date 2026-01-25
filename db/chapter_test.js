const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function addChapterTest({ timer_minutes, size, questions_pool }) {
    return executeSQLQueryParameterized(`INSERT INTO CHAPTER_TEST(timer_minutes,size,questions_pool) VALUES(?,?,?)`, [timer_minutes, size, questions_pool])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addChapterTest: ${error}`));
}

//freeze
function getChapterTestByChapterId({ chapter_id }) {
    return executeSQLQueryParameterized(`SELECT * FROM CHAPTER_TEST WHERE chapter_id=?`, [chapter_id]).catch((error) =>
        logger.error(`getChapterTestByChapterId: ${error}`),
    );
}

module.exports = { addChapterTest, getChapterTestByChapterId };
