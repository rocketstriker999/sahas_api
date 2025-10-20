const libExpress = require("express");
const logger = require("./libs/logger");
const cors = require("cors");
const { ROUTE_NOT_FOUND } = require("./constants");

//Required Middlewares #5
const requiresDeviceFingerPrint = require("./middlewares/requires_device_finger_print");
const requiresNoMaintenance = require("./middlewares/requires_no_maintenance");

//Common Middlewares
const parseAuthenticationToken = require("./middlewares/parse_authentication_token");
const parseUserDevice = require("./middlewares/parse_user_device");
const logRequest = require("./middlewares/log_request");

//api server #8
const sahasAPI = libExpress();

// Use the CORS middleware to allow cross origin request in case of testing UI Localhost and Cookies as well
sahasAPI.use(cors({ origin: process.env.ALLOWED_CORS_ORIGINS }));

//allow json request payloads and cookies only by express
sahasAPI.use(libExpress.json());
sahasAPI.use(libExpress.urlencoded({ extended: true }));

//Apply Middlewares #17
//sahasAPI.use((req, res, next) => setTimeout(next, 200));

sahasAPI.use(requiresNoMaintenance);
sahasAPI.use(requiresDeviceFingerPrint);
sahasAPI.use(parseAuthenticationToken);
sahasAPI.use(parseUserDevice);
sahasAPI.use(logRequest);

//api end points and routers
const routers = {
    "/template-configs": { middlewares: [], router: require("./routes/template_configs") },

    "/authentication-tokens": { middlewares: [], router: require("./routes/authentication_tokens") },

    "/course-categories": { middlewares: [], router: require("./routes/course_categories") },
    "/courses": { middlewares: [], router: require("./routes/courses") },
    "/course-subjects": { middlewares: [], router: require("./routes/course_subjects") },
    "/subjects": { middlewares: [], router: require("./routes/subjects") },
    "/chapter-types": { middlewares: [], router: require("./routes/chapter_types") },
    "/chapters": { middlewares: [], router: require("./routes/chapters") },

    "/filters": { middlewares: [], router: require("./routes/filters") },

    "/users": { middlewares: [], router: require("./routes/users") },

    "/inquiries": { middlewares: [], router: require("./routes/inquiries") },
    "/inquiry-notes": { middlewares: [], router: require("./routes/inquiry_notes") },

    "/enrollments": { middlewares: [], router: require("./routes/enrollments") },
    "/enrollment-transactions": { middlewares: [], router: require("./routes/enrollment_transactions") },
    "/enrollment-courses": { middlewares: [], router: require("./routes/enrollment_courses") },

    "/wallet-transactions": { middlewares: [], router: require("./routes/wallet_transactions") },

    "/coupon-codes": { middlewares: [], router: require("./routes/coupon_codes") },

    "/roles": { middlewares: [], router: require("./routes/roles") },
    "/user-roles": { middlewares: [], router: require("./routes/user_roles") },

    "/authorities": { middlewares: [], router: require("./routes/authorities") },
    "/role-authorities": { middlewares: [], router: require("./routes/role_authorities") },
};

//apply all routes
Object.entries(routers).forEach(([path, routeHandler]) => sahasAPI.use(path, ...routeHandler?.middlewares, routeHandler.router));

//if api path is not processable
sahasAPI.use((req, res) => res.status(404).json({ error: ROUTE_NOT_FOUND }));

//APP Port and start app
const allowTraffic = () => sahasAPI.listen(process.env.SERVER_PORT, () => logger.success(`APIs started at ${process.env.SERVER_PORT}`));

//global exception handling
process.on("uncaughtException", (error) => logger.error(error));

module.exports = { allowTraffic };
