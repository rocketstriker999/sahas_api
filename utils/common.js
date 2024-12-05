const libFs = require("fs");
const libPath = require("path");

const prepareDirectories = (directories) =>
    directories.forEach((directory) => libFs.existsSync(libPath.join(process.cwd(), directory)) || libFs.mkdirSync(libPath.join(process.cwd(), directory)));

module.exports = { prepareDirectories };
