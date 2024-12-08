const libFs = require("fs");

const libPath = require("path");

function writeConfig(configName, configuration) {}

function readConfig(configName) {
    return new Promise((resolve, reject) => {
        libFs.readFile(libPath.join(process.cwd(), process.env.DIR_CONFIGS, `${configName}.json`), "utf8", (error, jsonData) => {
            if (error) {
                reject(error); // Reject the promise if there's an error reading the file
            } else {
                resolve(JSON.parse(jsonData));
            }
        });
    });
}

module.exports = { writeConfig, readConfig };
