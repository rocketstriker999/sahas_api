const libExpress = require("express");
const libCookieParser = require("cookie-parser");
const logger = require("./libs/logger");
const cors = require("cors");

//api server
const sahasAPI = libExpress();

// Use the CORS middleware to allow cross origin request in case of testing UI Localhost and Cookies as well --
sahasAPI.use(cors({ origin: process.env.ALLOWED_CORS_ORIGINS }));

logger.info("allowed " + process.env.ALLOWED_CORS_ORIGINS);

//sahasAPI.use(require("./middlewares/device"));
sahasAPI.use((req, res, next) => {
    logger.info(`Incoming Request - ${req.method} ${req.url}`);
    next();
});

//allow json request payloads only
sahasAPI.use(libExpress.json());
sahasAPI.use(libExpress.urlencoded({ extended: true }));
//parse the cookies
sahasAPI.use(libCookieParser());

//api end points and routers
const routers = {
    "/data-dump": require("./routes/data_dump"),
    "/configs": require("./routes/configs"),
    "/users": require("./routes/users"),
    "/token": require("./routes/token"),
    "/otp": require("./routes/otp"),
    "/device": require("./routes/device"),
    "/transactions": require("./routes/transaction"),
    "/media": require("./routes/media"),
    "/extract": require("./routes/extract"),
    "/access": require("./routes/access"),
    "/catelogue": require("./routes/catelogue"),
    "/invoices": require("./routes/invoices"),
};

//apply all routes -
Object.entries(routers).forEach(([path, router]) => sahasAPI.use(path, router));

//if api path is not processable
sahasAPI.use((req, res) => res.status(400).json({ error: "Bad Request" }));

//APP Port and start app
const allowTraffic = () => sahasAPI.listen(process.env.SERVER_PORT, () => logger.success(`APIs started at ${process.env.SERVER_PORT}`));

process.on("uncaughtException", (error) => logger.error(error));

module.exports = { allowTraffic };
