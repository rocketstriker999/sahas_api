const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function addInvoice(transactionId) {
    return executeSQLQueryParameterized(`INSERT INTO USER_INVOICES(transaction_id) VALUES(?)`, [transactionId]).catch((error) =>
        logger.error(`addInvoice: ${error}`)
    );
}

function getInvoiceByTransactionId(transactionId) {
    return executeSQLQueryParameterized(`SELECT * FROM USER_INVOICES WHERE transaction_id=?`, [transactionId])
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => logger.error(`getInvoiceByTransactionId: ${error}`));
}

module.exports = { addInvoice, getInvoiceByTransactionId };
