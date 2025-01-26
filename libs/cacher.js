const { getAllCategories } = require("../db/categories");
const { getProductsByCategory } = require("../db/products");

const cache = {};

const add = (key, dataGenerator) => {
    dataGenerator.then((data) => {
        cache[key] = { data, dataGenerator };
        console.log(`[+]Cache Added - KEY:${key} `);
    });
};

const get = (key) => cache[key]?.data;

const refresh = (key) =>
    cache[key]?.dataGenerator.then((data) => {
        cache[key]["data"] = data;
        console.log(`[+]Cache Refreshed - KEY:${key} DATA:${data}`);
    });

module.exports = { add, get, refresh };
