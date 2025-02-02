const libFs = require("fs");

const libPath = require("path");

function getConfigs() {
    return new Promise((resolve, reject) => {
        libFs.readdir(libPath.join(process.cwd(), process.env.DIR_CONFIGS), (error, files) => {
            if (error) {
                reject(error); // Reject the promise if there's an error reading the file
            } else {
                resolve(files);
            }
        });
    });
}

function writeConfig(configName, configuration) {}

function readConfig(configName) {
    return new Promise((resolve, reject) => {
        libFs.readFile(libPath.join(process.cwd(), process.env.DIR_CONFIGS, configName), "utf8", (error, jsonData) => {
            if (error) {
                reject(error); // Reject the promise if there's an error reading the file
            } else {
                resolve(JSON.parse(jsonData));
            }
        });
    });
}

module.exports = { writeConfig, readConfig, getConfigs };
