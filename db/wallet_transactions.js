const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getWalletTransactionsByUserId(userId) {
    return executeSQLQueryParameterized(
        `SELECT WALLET_TRANSACTIONS.*,USERS.full_name AS created_by_full_name FROM WALLET_TRANSACTIONS LEFT JOIN USERS ON WALLET_TRANSACTIONS.created_by=USERS.id WHERE user_id=?`,
        [userId]
    ).catch((error) => {
        logger.error(`getWalletTransactionsByUserId: ${error}`);
        return [];
    });
}

function getWalletBalanceByUserId(userId) {
    return executeSQLQueryParameterized(`SELECT SUM(amount) AS balance FROM WALLET_TRANSACTIONS WHERE user_id=?`, [userId])
        .then((result) => (result.length > 0 ? result[0]?.balance : 0))
        .catch((error) => {
            logger.error(`getWalletTransactionsByUserId: ${error}`);
            return 0;
        });
}

module.exports = { getWalletTransactionsByUserId, getWalletBalanceByUserId };
