const libExpress = require("express");
const { getAccessesByToken } = require("../db/accesses");
const cacher = require("../libs/cacher");
const { KEY_AUTHENTICATION_TOKEN } = require("../constants");
const router = libExpress.Router();

//get catelogue for user
router.get("/", async (req, res) => {
    //get user's accesses
    const userAccesses = req?.user
        ? Object.assign({}, ...(await getAccessesByToken(req.headers?.[KEY_AUTHENTICATION_TOKEN]))?.map((access) => ({ [access.product_id]: access.invoice })))
        : [];

    //prepare and return catelogue
    res.status(200).json({
        categories: cacher.get(process.env.CACHE_KEYS_CATEGORIES),
        products: cacher.get(process.env.CACHE_KEYS_PRODUCTS)?.map((product) => ({
            ...product,
            ...(Object.keys(userAccesses)?.includes(product.id.toString()) && { has_access: true, invoice: userAccesses[product.id.toString()] }),
        })),
        courses: cacher.get(process.env.CACHE_KEYS_COURSES),
        subjects: cacher.get(process.env.CACHE_KEYS_SUBJECTS),
        chapters: cacher.get(process.env.CACHE_KEYS_CHAPTERS),
    });
});

module.exports = router;
