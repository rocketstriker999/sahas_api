const libChalk = require("chalk");
const libFs = require("fs");
const libPath = require("path");
const libOS = require("os");

//prepare a common log function
const log = console.log;

//logs directory
const logsDirectory = libPath.join(process.cwd(), process.env.DIRECTORY_LOGS);

const getCurrentDateTime = () => {
    let currentTimeStamp = new Date();
    let logDateTime = [
        currentTimeStamp.getHours() < 10 ? "0" + currentTimeStamp.getHours() : currentTimeStamp.getHours(),
        currentTimeStamp.getMinutes() < 10 ? "0" + currentTimeStamp.getMinutes() : currentTimeStamp.getMinutes(),
        currentTimeStamp.getSeconds() < 10 ? "0" + currentTimeStamp.getSeconds() : currentTimeStamp.getSeconds(),
    ].join(":");

    return { currentTimeStamp, logDateTime };
};

//print normal statments
const info = (logStatement) => {
    const { currentTimeStamp, logDateTime } = getCurrentDateTime();
    logStatement = `[#]${logDateTime} INFO -> ${logStatement}`;
    log(libChalk.blue(logStatement));
    saveLogs(currentTimeStamp, logStatement);
};

//print normal statments
const success = (logStatement) => {
    const { currentTimeStamp, logDateTime } = getCurrentDateTime();
    logStatement = `[+]${logDateTime} INFO -> ${logStatement}`;
    log(libChalk.green(logStatement));
    saveLogs(currentTimeStamp, logStatement);
};

//print normal statments
const error = (logStatement) => {
    const { currentTimeStamp, logDateTime } = getCurrentDateTime();
    logStatement = `[-]${logDateTime} ERROR -> ${logStatement}`;
    log(libChalk.red(logStatement));
    saveLogs(currentTimeStamp, logStatement);
};

const saveLogs = (currentTimeStamp, logStatement) => {
    if (process.env.SAVE_LOGS) {
        const logFileName = currentTimeStamp.toLocaleDateString("en-GB").split("/").join("-");

        libFs.open(libPath.join(logsDirectory, logFileName), "a", (error, logFileDescriptor) => {
            if (!error && logFileDescriptor) {
                libFs.writeFile(logFileDescriptor, logStatement + libOS.EOL, (error) => {
                    if (!error)
                        libFs.close(logFileDescriptor, (error) => {
                            if (error) log(libChalk.red(`[-] Failed To Close Log File : ${error}`));
                        });
                    else log(libChalk.red(`[-] Failed To Write Log File : ${error}`));
                });
            } else log(libChalk.red(`[-] Failed To Open Log File : ${error}`));
        });
    }
};

module.exports = { info, success, error };
