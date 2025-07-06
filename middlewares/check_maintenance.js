const { REQUEST_DENIED, SERVER_UNDER_MAINTENANCE } = require("../constants");
const { readConfig } = require("../libs/config");
const logger = require("../libs/logger");

module.exports = async (req, res, next) => {
    const { general: generalConfig } = await readConfig("app");

    //if maintenance mode is disabled, then allow the request to proceed
    if (generalConfig && generalConfig?.under_maintance === false) {
        return next();
    }
    logger.error(`${REQUEST_DENIED} - ${SERVER_UNDER_MAINTENANCE}`);
    return res.status(503).json({ error: SERVER_UNDER_MAINTENANCE });
};
