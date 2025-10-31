const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

//freeze
function getWalletTransactionsByUserId({ user_id }) {
    return executeSQLQueryParameterized(
        `SELECT WALLET_TRANSACTIONS.*,USERS.full_name AS created_by_full_name FROM WALLET_TRANSACTIONS LEFT JOIN USERS ON WALLET_TRANSACTIONS.created_by=USERS.id WHERE user_id=? ORDER BY WALLET_TRANSACTIONS.id DESC`,
        [user_id]
    ).catch((error) => {
        logger.error(`getWalletTransactionsByUserId: ${error}`);
        return [];
    });
}

//freeze
function addWalletTransaction({ user_id, amount, note, created_by }) {
    return executeSQLQueryParameterized(`INSERT INTO WALLET_TRANSACTIONS (user_id,amount,note,created_by) VALUES(?,?,?,?)`, [user_id, amount, note, created_by])
        .then((result) => result.insertId)
        .catch((error) => logger.error(`addWalletTransaction: ${error}`));
}

//freeze
function getWalletBalanceByUserId({ user_id }) {
    return executeSQLQueryParameterized(`SELECT SUM(amount) AS wallet_balance FROM WALLET_TRANSACTIONS WHERE user_id=? `, [user_id])
        .then((results) => (results.length > 0 ? results[0]?.wallet_balance : 0))
        .catch((error) => logger.error(`getWalletBalanceByUserId: ${error}`));
}

//freeze
function getWalletTransactionById({ id }) {
    return executeSQLQueryParameterized(
        `SELECT WALLET_TRANSACTIONS.*,USERS.full_name AS created_by_full_name FROM WALLET_TRANSACTIONS LEFT JOIN USERS ON WALLET_TRANSACTIONS.created_by=USERS.id WHERE WALLET_TRANSACTIONS.id=? `,
        [id]
    )
        .then((results) => (results.length > 0 ? results[0] : null))
        .catch((error) => logger.error(`getWalletTransactionById: ${error}`));
}

module.exports = { getWalletTransactionsByUserId, addWalletTransaction, getWalletTransactionById, getWalletBalanceByUserId };
