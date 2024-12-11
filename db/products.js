const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

function getProductForTransaction(productId) {
    return executeSQLQueryParameterized(`SELECT id,title,price,discounted FROM PRODUCTS WHERE id=?`, [productId])
        .then((result) => result.length > 0 && result[0])
        .catch((error) => {
            logger.error(`Error While Updating Token: ${error}`);
            return false;
        });
}

module.exports = { getProductForTransaction };
