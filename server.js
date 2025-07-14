const libExpress = require("express");
const logger = require("./libs/logger");
const cors = require("cors");
const { ROUTE_NOT_FOUND } = require("./constants");

//Required Middlewares #1
const requiresDeviceFingerPrint = require("./middlewares/requires_device_finger_print");
const requiresNoMaintenance = require("./middlewares/requires_no_maintenance");

//Common Middlewares
const parseAuthenticationToken = require("./middlewares/parse_authentication_token");
const parseUserDevice = require("./middlewares/parse_user_device");
const logRequest = require("./middlewares/log_request");

//api server #6
const sahasAPI = libExpress();

// Use the CORS middleware to allow cross origin request in case of testing UI Localhost and Cookies as well
sahasAPI.use(cors({ origin: process.env.ALLOWED_CORS_ORIGINS }));

//allow json request payloads and cookies only by express
sahasAPI.use(libExpress.json());
sahasAPI.use(libExpress.urlencoded({ extended: true }));

//Apply Middlewares #3
sahasAPI.use((req, res, next) => setTimeout(next, 3000));

sahasAPI.use(requiresNoMaintenance);
sahasAPI.use(requiresDeviceFingerPrint);
sahasAPI.use(parseAuthenticationToken);
sahasAPI.use(parseUserDevice);
sahasAPI.use(logRequest);

//api end points and routers
const routers = {
    "/data-dump": { middlewares: [], router: require("./routes/data_dump") },
    "/configs": { middlewares: [], router: require("./routes/configs") },
    // "/users": { middlewares: [], router: require("./routes/users") },
    // "/token": { middlewares: [], router: require("./routes/token") },
    "/authentication-tokens": { middlewares: [], router: require("./routes/authentication_tokens") },
    // "/device": { middlewares: [], router: require("./routes/device") },
    // "/transactions": { middlewares: [], router: require("./routes/transaction") },
    // "/media": { middlewares: [requiresAuthentication], router: require("./routes/media") },
    // "/extract": { middlewares: [], router: require("./routes/extract") },
    // "/access": { middlewares: [], router: require("./routes/access") },
    "/catelogue": { middlewares: [], router: require("./routes/catelogue") },
    // "/invoices": { middlewares: [], router: require("./routes/invoices") },
};

//apply all routes -
Object.entries(routers).forEach(([path, routeHandler]) => sahasAPI.use(path, ...routeHandler?.middlewares, routeHandler.router));

//if api path is not processable
sahasAPI.use((req, res) => res.status(404).json({ error: ROUTE_NOT_FOUND }));

//APP Port and start app
const allowTraffic = () => sahasAPI.listen(process.env.SERVER_PORT, () => logger.success(`APIs started at ${process.env.SERVER_PORT}`));

//global exception handling
process.on("uncaughtException", (error) => logger.error(error));

module.exports = { allowTraffic };
