const { getAllCategories, getAllCategoriesForCache } = require("../db/categories");
const { getAllChaptersForCache } = require("../db/chapters");
const { getAllCoursesForCache } = require("../db/courses");
const { getAllProducts } = require("../db/products");
const { getAllSubjectsForCache } = require("../db/subjects");
const logger = require("./logger");

const cache = {};

const add = (key, dataGenerator) => {
    dataGenerator().then((data) => {
        cache[key] = { data, dataGenerator };
        logger.info(`[+]Cache Added - KEY:${key} `);
    });
};

const get = (key) => cache[key]?.data;

const refresh = (key) =>
    cache[key]?.dataGenerator().then((data) => {
        cache[key]["data"] = data;
        logger.success(`[+]Cache Refreshed - KEY:${key} DATA:${JSON.stringify(data)}`);
    });

const generateCaches = () => {
    add(process.env.CACHE_KEYS_CATEGORIES, getAllCategoriesForCache);
    add(process.env.CACHE_KEYS_PRODUCTS, getAllProducts);
    add(process.env.CACHE_KEYS_COURSES, getAllCoursesForCache);
    add(process.env.CACHE_KEYS_SUBJECTS, getAllSubjectsForCache);
    add(process.env.CACHE_KEYS_CHAPTERS, getAllChaptersForCache);
};

module.exports = { add, get, refresh, generateCaches };
