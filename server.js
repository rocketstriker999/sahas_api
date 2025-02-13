const libExpress = require("express");
const libCookieParser = require("cookie-parser");
const logger = require("./libs/logger");

//api server
const sahasAPI = libExpress();

//requests are only acceptable from UI
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
    "/ui-config": require("./routes/ui_config"),
    "/users": require("./routes/users"),
    "/token": require("./routes/token"),
    "/otp": require("./routes/otp"),
    "/device": require("./routes/device"),
    "/products": require("./routes/products"),
    "/transactions": require("./routes/transaction"),
    "/content": require("./routes/content"),
    "/access": require("./routes/access"),
};

//apply all routes -
Object.entries(routers).forEach(([path, router]) => sahasAPI.use(path, router));

//if api path is not processable
sahasAPI.use((req, res) => res.status(400).json({ error: "Bad Request" }));

const allowTraffic = () => {
    //APP Port and start app
    sahasAPI.listen(process.env.SERVER_PORT, () => logger.success(`APIs started at ${process.env.SERVER_PORT}`));
};

module.exports = { allowTraffic };
