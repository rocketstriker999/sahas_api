const libExpress = require("express");
const libCookieParser = require("cookie-parser");
const logger = require("./libs/logger");
const requests = require("./middlewares/logging/request");
const requiresAuthentication = require("./middlewares/requires/authentication");
const parseDevice = require("./middlewares/parsers/device");
const parseToken = require("./middlewares/parsers/auth_token");

//api server
const sahasAPI = libExpress();

//coomon middlewares
sahasAPI.use(requests);
sahasAPI.use(parseToken);
sahasAPI.use(parseDevice);

//allow json request payloads only
sahasAPI.use(libExpress.json());
sahasAPI.use(libExpress.urlencoded({ extended: true }));
//parse the cookies
sahasAPI.use(libCookieParser());

//api end points and routers
const routers = {
    "/data-dump": { middlewares: [], router: require("./routes/data_dump") },
    "/configs": { middlewares: [], router: require("./routes/configs") },
    "/users": { middlewares: [], router: require("./routes/users") },
    "/token": { middlewares: [], router: require("./routes/token") },
    "/otp": { middlewares: [], router: require("./routes/otp") },
    "/device": { middlewares: [], router: require("./routes/device") },
    "/transactions": { middlewares: [], router: require("./routes/transaction") },
    "/media": { middlewares: [requiresAuthentication], router: require("./routes/media") },
    "/extract": { middlewares: [], router: require("./routes/extract") },
    "/access": { middlewares: [], router: require("./routes/access") },
    "/catelogue": { middlewares: [], router: require("./routes/catelogue") },
    "/invoices": { middlewares: [], router: require("./routes/invoices") },
};

//apply all routes -
Object.entries(routers).forEach(([path, routeHandler]) => sahasAPI.use(path, ...routeHandler?.middlewares, routeHandler.router));

//if api path is not processable
sahasAPI.use((req, res) => res.status(400).json({ error: "Bad Request" }));

//APP Port and start app
const allowTraffic = () => sahasAPI.listen(process.env.SERVER_PORT, () => logger.success(`APIs started at ${process.env.SERVER_PORT}`));

process.on("uncaughtException", (error) => logger.error(error));

module.exports = { allowTraffic };
