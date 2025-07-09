const { getAllCategories } = require("../db/categories");
const { getAllChapters } = require("../db/chapters");
const { getAllCourses } = require("../db/courses");
const { getAllSubjects } = require("../db/subjects");
const logger = require("./logger");

const cache = {};

const add = (key, dataGenerator) => {
    dataGenerator().then((data) => {
        cache[key] = { data, dataGenerator };
        logger.info(`Cache Added - KEY:${key} `);
    });
};

const get = (key) => cache?.[key]?.data;

const refresh = (key) =>
    cache[key]?.dataGenerator().then((data) => {
        cache?.[key]["data"] = data;
        logger.success(`Cache Refreshed - KEY:${key}`);
    });

const generateCaches = () => {
    add(process.env.CACHE_KEYS_CATEGORIES, getAllCategories);
    add(process.env.CACHE_KEYS_COURSES, getAllCourses);
    add(process.env.CACHE_KEYS_SUBJECTS, getAllSubjects);
    add(process.env.CACHE_KEYS_CHAPTERS, getAllChapters);
};

module.exports = { add, get, refresh, generateCaches };
