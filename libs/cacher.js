const { CACHE_KEY_COURSE_CATEGORIES, CACHE_KEY_COURSES, CACHE_KEY_SUBJECTS, CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS } = require("../constants");
const { getAllCourseCategories } = require("../db/course_categories");
const { getAllCourses } = require("../db/courses");
const { getAllPaymentGateWayPayLoads } = require("../db/payment_gateway_payloads");
const { getAllSubjects } = require("../db/subjects");
const logger = require("./logger");

const cache = {};

const add = (key, dataGenerator) =>
    dataGenerator().then((data) => {
        cache[key] = { data, dataGenerator };
        logger.success(`Cache Added - KEY:${key} `);
    });

const get = (key) => cache?.[key]?.data;

const refresh = (key) =>
    cache[key]?.dataGenerator().then((data) => {
        cache[key]["data"] = data;
        logger.success(`Cache Refreshed - KEY:${key}`);
    });

const generateCaches = async () => {
    await add(CACHE_KEY_COURSE_CATEGORIES, getAllCourseCategories);
    await add(CACHE_KEY_COURSES, getAllCourses);
    await add(CACHE_KEY_SUBJECTS, getAllSubjects);
    await add(CACHE_KEY_PAYMENT_GATEWAY_PAYLOADS, getAllPaymentGateWayPayLoads);
};

module.exports = { add, get, refresh, generateCaches };
