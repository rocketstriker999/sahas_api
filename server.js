const libExpress = require("express");
const logger = require("./libs/logger");
const cors = require("cors");
const { ROUTE_NOT_FOUND } = require("./constants");

//Required Middlewares #1
const deviceCheck = require("./middlewares/check_device");
const maintenanceCheck = require("./middlewares/check_maintenance");
const requiresAuthentication = require("./middlewares/requires_authentication");

//Common Middlewares
const parseUser = require("./middlewares/parse_user");
const parseUserDeviceMapping = require("./middlewares/parse_user_device_mapping");
const logRequest = require("./middlewares/log_request");

//api server #4
const sahasAPI = libExpress();

// Use the CORS middleware to allow cross origin request in case of testing UI Localhost and Cookies as well
sahasAPI.use(cors({ origin: process.env.ALLOWED_CORS_ORIGINS }));

//allow json request payloads and cookies only by express
sahasAPI.use(libExpress.json());
sahasAPI.use(libExpress.urlencoded({ extended: true }));

//Apply Middlewares
sahasAPI.use((req, res, next) => setTimeout(next, 1500));

sahasAPI.use(deviceCheck);
sahasAPI.use(maintenanceCheck);
sahasAPI.use(parseUser);
sahasAPI.use(parseUserDeviceMapping);
sahasAPI.use(logRequest);

//api end points and routers
const routers = {
    "/data-dump": { middlewares: [], router: require("./routes/data_dump") },
    "/configs": { middlewares: [], router: require("./routes/configs") },
    // "/users": { middlewares: [], router: require("./routes/users") },
    // "/token": { middlewares: [], router: require("./routes/token") },
    // "/otp": { middlewares: [], router: require("./routes/otp") },
    // "/device": { middlewares: [], router: require("./routes/device") },
    // "/transactions": { middlewares: [], router: require("./routes/transaction") },
    // "/media": { middlewares: [requiresAuthentication], router: require("./routes/media") },
    // "/extract": { middlewares: [], router: require("./routes/extract") },
    // "/access": { middlewares: [], router: require("./routes/access") },
    // "/catelogue": { middlewares: [], router: require("./routes/catelogue") },
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
