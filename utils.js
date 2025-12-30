const libFs = require("fs");
const libPath = require("path");
const libCrypto = require("crypto");
const { logger } = require("sahas_utils");
const { readConfig } = require("./libs/config");
const libMoment = require("moment");
const { SMTP_EMAILS } = require("./constants");

const prepareDirectories = (directories) => {
    directories.forEach((directory) => {
        const fullPath = libPath.join(process.cwd(), directory);
        if (!libFs.existsSync(fullPath)) {
            libFs.mkdirSync(fullPath, { recursive: true });
        }
    });
};

function getRandomSMTPEmail() {
    return SMTP_EMAILS[Math.floor(Math.random() * SMTP_EMAILS.length)];
}

function generateToken() {
    const timestamp = Date.now().toString(); // Current timestamp in milliseconds - 1
    const randomPart = Math.random().toString(36).substring(2, 18); // Random alphanumeric string
    const token = (timestamp + randomPart).substring(0, 36); // Ensure token is 32 characters long
    return token;
}

function getDateByInterval({ baseDate = libMoment(), days }) {
    return libMoment(baseDate).add(days, "days");
}

function getFormattedDate({ date, format = "YYYY-MM-DD" }) {
    return libMoment(date).format(format);
}

function getDifferenceOfDates({ start_date, end_date }) {
    return libMoment(end_date).diff(libMoment(start_date), "days");
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

async function verifyPaymentGatewayPayLoadStatus(paymentGateWayPayLoad) {
    const { paymentGateWay: { verificationAPI, merchantKey, merchantSalt } = {} } = await readConfig("app");

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const urlencoded = new URLSearchParams();
    urlencoded.append("key", merchantKey);
    urlencoded.append("command", "verify_payment");
    urlencoded.append("var1", paymentGateWayPayLoad?.transaction?.id);
    urlencoded.append("hash", generateSHA512(`${merchantKey}|verify_payment|${paymentGateWayPayLoad?.transaction?.id}|${merchantSalt}`));

    const fetchOptions = {
        method: "POST",
        headers: headers,
        body: urlencoded,
        redirect: "follow",
    };
    try {
        const response = await fetch(verificationAPI, fetchOptions);
        const verificationResponse = await response.json();
        paymentGateWayPayLoad.transaction.paid = verificationResponse?.transaction_details[paymentGateWayPayLoad?.transaction?.id]?.status === "success";
    } catch (error) {
        logger.error(`Failed to Check Status For Transaction - ${paymentGateWayPayLoad.transaction.id} - error ${error}`);
    } finally {
        return paymentGateWayPayLoad;
    }
}

module.exports = {
    prepareDirectories,
    generateToken,
    requestPayUVerification,
    generateSHA512,
    getDeviceDescriptionByFingerPrint,
    verifyPaymentGatewayPayLoadStatus,
    getDateByInterval,
    getFormattedDate,
    getDifferenceOfDates,
    getRandomSMTPEmail,
};
