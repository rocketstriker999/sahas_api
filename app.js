require("dotenv").config();

const { allowTraffic } = require("./server");
const { logger } = require("sahas_utils");
const { generateDBTables } = require("./libs/db");
const { prepareDirectories } = require("./utils");
const { generateCaches } = require("./libs/cacher");

//prepare logs directories at first #9
prepareDirectories([process.env.DIRECTORY_LOGS, process.env.DIR_CONFIGS]);

// Test and Prepare Required Tables
const prepareAppDependacies = async () => {
    await generateDBTables()
        .then(() => logger.success("Database Ready"))
        .then(generateCaches)
        .catch((error) => logger.error(`Failed To Prepare Cache ${error}`))
        .then(allowTraffic)
        .catch((error) => logger.error(`Failed To Prepare Database ${error}`));
};

prepareAppDependacies();
