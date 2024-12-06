require("dotenv").config();
const libExpress = require("express");
const libCookieParser = require("cookie-parser");
const { prepareDirectories } = require("./utils/common");

const logger = require("./utils/logger");

//prepare required directories
//check if logs directory exist
prepareDirectories([process.env.DIRECTORY_LOGS]);

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
//parse the cookies
sahasAPI.use(libCookieParser());

//api end points and routers
const routers = {
    "/ui-config": require("./routes/ui_config"),
    "/users": require("./routes/users"),
    "/token": require("./routes/token"),
    "/otp": require("./routes/otp"),
    "/device": require("./routes/device"),
    "/products": require("./routes/products"),
    "/courses": require("./routes/courses"),
};

//apply all routes
Object.entries(routers).forEach(([path, router]) => sahasAPI.use(path, router));

//if api path is not processable
sahasAPI.use((req, res) => res.status(404));

//APP Port and start app
sahasAPI.listen(process.env.SERVER_PORT, () => logger.success(`APIs started at ${process.env.SERVER_PORT}`));
