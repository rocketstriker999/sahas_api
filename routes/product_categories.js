const libExpress = require("express");
const { getAllproductCategories, addProductCategory, getProductCategoryById } = require("../db/product_categories");
const { validateRequestBody } = require("../utils");
const router = libExpress.Router();

//tested
router.get("/", async (req, res) => {
    //provide all the product categories
    res.status(200).json(await getAllproductCategories());
});

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["title", "image"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const productCategoryId = await addProductCategory(validatedRequestBody);
        if (productCategoryId) res.status(201).json(await getProductCategoryById({ id: productCategoryId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.get("/:id/products", async (req, res) => {
    res.status(200).json([]);
});

module.exports = router;
