const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getContentById(contentId) {
    const content = {};
    return executeSQLQueryParameterized(`SELECT * FROM CONTENT_VIDEOS WHERE content_id=?`, [contentId])
        .then((result) => (content.videos = result))
        .then(() => executeSQLQueryParameterized(`SELECT * FROM CONTENT_PDFS WHERE content_id=?`, [contentId]))
        .then((result) => (content.pdfs = result))
        .then(() => executeSQLQueryParameterized(`SELECT * FROM CONTENT_AUDIOS WHERE content_id=?`, [contentId]))
        .then((result) => (content.audios = result))
        .then(() => content)
        .catch((error) => logger.error(`addInvoice: ${error}`));
}

function verifyContentAccess(contentId) {}

module.exports = { getContentById };
