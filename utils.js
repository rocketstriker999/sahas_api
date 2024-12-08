const libFs = require("fs");
const libPath = require("path");

const prepareDirectories = (directories) =>
    directories.forEach((directory) => libFs.existsSync(libPath.join(process.cwd(), directory)) || libFs.mkdirSync(libPath.join(process.cwd(), directory)));

async function requestService({
    requestHeaders = {},
    requestPath = "/",
    requestMethod = "GET",
    requestGetQuery = false,
    requestPostBody = false,
    onRequestStart = false,
    onResponseReceieved = false,
    onRequestFailure = false,
    onRequestEnd = false,
} = {}) {
    if (onRequestStart) await onRequestStart();

    //api specific path
    requestPath = process.env.SERVICE_GATEWAY.concat(requestPath);

    if (requestGetQuery) {
        requestPath = requestPath + "?";
        requestPath =
            requestPath +
            Object.keys(requestGetQuery)
                .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(requestGetQuery[key]))
                .join("&");
    }

    const fetchOptions = {
        // Adding headers to the request
        //headers: {requestHeaders,...currentDevice},
        headers: {
            "Content-Type": "application/json",
            ...requestHeaders,
        },
        // Adding method type
        method: requestMethod.toUpperCase(),
    };

    if (requestPostBody) {
        fetchOptions.body = JSON.stringify(requestPostBody);
    }

    try {
        const response = await fetch(requestPath, fetchOptions);
        const jsonResponse = await response.json();
        if (onResponseReceieved) onResponseReceieved(jsonResponse, response.status);
    } catch (e) {
        if (onRequestFailure) onRequestFailure(e);
    }
    if (onRequestEnd) onRequestEnd();
}

module.exports = { prepareDirectories, requestService };
