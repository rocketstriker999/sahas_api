const libExpress = require("express");
const { getAllCategoriesForCache } = require("../db/categories");
const { getAllProducts } = require("../db/products");
const { getAccessesByToken } = require("../db/accesses");
const { getAllCoursesForCache } = require("../db/courses");
const { getAllSubjectsForCache } = require("../db/subjects");
const { getAllChaptersForCache } = require("../db/chapters");
const cacher = require("../libs/cacher");
const router = libExpress.Router();

cacher.add(process.env.CACHE_KEYS_CATEGORIES, getAllCategoriesForCache());
cacher.add(process.env.CACHE_KEYS_PRODUCTS, getAllProducts());
cacher.add(process.env.CACHE_KEYS_COURSES, getAllCoursesForCache());
cacher.add(process.env.CACHE_KEYS_SUBJECTS, getAllSubjectsForCache());
cacher.add(process.env.CACHE_KEYS_CHAPTERS, getAllChaptersForCache());

//get catelogue for user
router.get("/", async (req, res) => {
    //get user's accesses
    const userAccesses = (await getAccessesByToken(req.cookies.token))?.map((access) => access.product_id);
    //prepare and return catelogue
    res.status(200).json({
        categories: cacher.get(process.env.CACHE_KEYS_CATEGORIES),
        products: cacher.get(process.env.CACHE_KEYS_PRODUCTS)?.map((product) => ({ ...product, has_access: userAccesses?.includes(product.id) })),
        courses: cacher.get(process.env.CACHE_KEYS_COURSES),
        subjects: cacher.get(process.env.CACHE_KEYS_SUBJECTS),
        chapters: cacher.get(process.env.CACHE_KEYS_CHAPTERS),
    });
});

module.exports = router;
