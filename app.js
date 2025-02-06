require("dotenv").config();

const { allowTraffic } = require("./server");
const logger = require("./libs/logger");
const { generateDBTables } = require("./libs/db");
const { prepareDirectories } = require("./utils");
const { generateCaches } = require("./libs/cacher");

//prepare logs directories at first
prepareDirectories([process.env.DIRECTORY_LOGS, process.env.DIR_CONFIGS]);

// Test and Prepare Required Tables
generateDBTables()
    .then(() => {
        logger.success("[+]Database Ready");
        allowTraffic();
        generateCaches();
    })
    .catch((error) => logger.error(`[-]Failed To Prepare Database ${error}`));
