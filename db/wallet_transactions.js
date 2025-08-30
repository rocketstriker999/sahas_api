const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getWalletTransactionsByUserId(userId) {
    return executeSQLQueryParameterized(
        `SELECT WALLET_TRANSACTIONS.*,USERS.full_name AS created_by_full_name FROM WALLET_TRANSACTIONS LEFT JOIN USERS ON WALLET_TRANSACTIONS.created_by=USERS.id WHERE user_id=? ORDER BY WALLET_TRANSACTIONS.id DESC`,
        [userId]
    ).catch((error) => {
        logger.error(`getWalletTransactionsByUserId: ${error}`);
        return [];
    });
}

function addWalletTransaction({ user_id, amount, note, created_by }) {
    return executeSQLQueryParameterized(`INSERT INTO WALLET_TRANSACTIONS (user_id,amount,note,created_by) VALUES(?,?,?,?)`, [user_id, amount, note, created_by])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addWalletTransaction: ${error}`);
            return 0;
        });
}

function getWalletTransactionByWalletTransactionId(walletTransactionId) {
    return executeSQLQueryParameterized(
        `SELECT WALLET_TRANSACTIONS.*,USERS.full_name AS created_by_full_name FROM WALLET_TRANSACTIONS LEFT JOIN USERS ON WALLET_TRANSACTIONS.created_by=USERS.id WHERE WALLET_TRANSACTIONS.id=? `,
        [walletTransactionId]
    )
        .then((results) => (results.length > 0 ? results[0] : null))
        .catch((error) => {
            logger.error(`getWalletTransactionByWalletTransactionId: ${error}`);
        });
}

module.exports = { getWalletTransactionsByUserId, getWalletBalanceByUserId, addWalletTransaction, getWalletTransactionByWalletTransactionId };
