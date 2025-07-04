const libFs = require("fs");

const libPath = require("path");

// write configuration and save
function writeConfig(configName, configuration) {
    return new Promise((resolve, reject) => {
        libFs.writeFile(libPath.join(process.cwd(), process.env.DIR_CONFIGS, configName), JSON.stringify(configuration, null, 2), "utf8", (error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

//read a perticular configuration
function readConfig(configName) {
    return new Promise((resolve, reject) => {
        libFs.readFile(libPath.join(process.cwd(), process.env.DIR_CONFIGS, configName.concat(".json")), "utf8", (error, jsonData) => {
            if (error) {
                reject(error); // Reject the promise if there's an error reading the file
            } else {
                resolve(JSON.parse(jsonData));
            }
        });
    });
}

module.exports = { writeConfig, readConfig, getConfigs };
