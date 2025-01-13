require("dotenv").config();

const { allowTraffic } = require("./server");
const logger = require("./libs/logger");
const { generateDBTables } = require("./libs/db");
const { prepareDirectories } = require("./utils");

//prepare logs directories at first
prepareDirectories([process.env.DIRECTORY_LOGS, process.env.DIR_CONFIGS]);

// Test and Prepare Required Tables
generateDBTables()
    .then(() => {
        logger.success("[+]Database Ready");
        allowTraffic();
    })
    .catch((error) => logger.error(`[-]Failed To Prepare Database ${error}`));
