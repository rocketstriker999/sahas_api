const libFs = require("fs");
const libPath = require("path");
const libCrypto = require("crypto");
const logger = require("./libs/logger");
const { readConfig } = require("./libs/config");

const prepareDirectories = (directories) => {
    directories.forEach((directory) => {
        const fullPath = libPath.join(process.cwd(), directory);
        if (!libFs.existsSync(fullPath)) {
            libFs.mkdirSync(fullPath, { recursive: true });
        }
    });
};

function generateToken() {
    const timestamp = Date.now().toString(); // Current timestamp in milliseconds - 1
    const randomPart = Math.random().toString(36).substring(2, 18); // Random alphanumeric string
    const token = (timestamp + randomPart).substring(0, 36); // Ensure token is 32 characters long
    return token;
}

function generateSHA512(targetString) {
    return libCrypto.createHash("sha512").update(targetString).digest("hex");
}

const getDeviceDescriptionByFingerPrint = (fingerPrint) => Buffer.from(fingerPrint, "base64").toString("utf8");

async function requestPayUVerification(transaction, command = process.env.TRANSACTION_VERIFICATION_COMMAND) {
    if (transaction.pay > 0) {
        const headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        const urlencoded = new URLSearchParams();
        urlencoded.append("key", process.env.MERCHANT_KEY);
        urlencoded.append("command", command);
        urlencoded.append("var1", transaction.id);
        urlencoded.append("hash", generateSHA512(`${process.env.MERCHANT_KEY}|${command}|${transaction.id}|${process.env.MERCHANT_SALT}`));

        const fetchOptions = {
            method: "POST",
            headers: headers,
            body: urlencoded,
            redirect: "follow",
        };
        try {
            const response = await fetch(process.env.TRANSACTION_VERIFICATION_URL, fetchOptions);
            const payuVerification = await response.json();
            return payuVerification?.transaction_details[transaction.id]?.status === "success";
        } catch {
            logger.error(`Failed to Check Status For Transaction - ${transaction.id}`);
            return false;
        }
    }
    return true;
}

function validateRequestBody(body, requiredFields) {
    const missingRequestBodyFields = requiredFields.filter((key) => body[key] === undefined || body[key] === null);

    return {
        isRequestBodyValid: missingRequestBodyFields.length === 0,
        missingRequestBodyFields,
        validatedRequestBody: Object.keys(body).reduce((obj, key) => {
            let value = body[key];
            if (typeof value === "string") {
                value = value.trim();
            }

            obj[key] = value;
            return obj;
        }, {}),
    };
}

async function verifyPaymentGatewayPayLoadStatus(paymentGateWayPayLoad) {
    const { paymentGateWay: { verificationAPI, merchantKey, merchantSalt } = {} } = await readConfig("app");

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("key", merchantKey);
    urlencoded.append("command", "verify_payment");
    urlencoded.append("var1", paymentGateWayPayLoad?.transaction?.id);
    urlencoded.append("hash", generateSHA512(`${merchantKey}|${"verify_payment"}|${paymentGateWayPayLoad?.transaction?.id}|${merchantSalt}`));

    const fetchOptions = {
        method: "POST",
        headers: headers,
        body: urlencoded,
        redirect: "follow",
    };
    try {
        const response = await fetch(verificationAPI, fetchOptions);
        const verificationResponse = await response.json();
        paymentGateWayPayLoad.transcation.paid = verificationResponse?.transaction_details[paymentGateWayPayLoad?.transaction?.id]?.status === "success";
    } catch {
        logger.error(`Failed to Check Status For Transaction - ${paymentGateWayPayLoad.transaction.id}`);
    } finally {
        return paymentGateWayPayLoad;
    }
}

async function requestService({
    requestHeaders = {},
    requestServiceName,
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
    requestPath = process.env.SERVICE_NGINX.concat(requestServiceName).concat(requestPath);

    if (requestGetQuery) {
        requestPath = requestPath + "?";
        requestPath =
            requestPath +
            Object.keys(requestGetQuery)
                .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(requestGetQuery[key]))
                .join("&");
    }

    const fetchOptions = {
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
module.exports = {
    prepareDirectories,
    requestService,
    generateToken,
    requestPayUVerification,
    generateSHA512,
    getDeviceDescriptionByFingerPrint,
    validateRequestBody,
    verifyPaymentGatewayPayLoadStatus,
};
