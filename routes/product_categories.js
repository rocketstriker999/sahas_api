const libExpress = require("express");
const { getAllproductCategories } = require("../db/product_categories");
const router = libExpress.Router();

//get all categories for user
router.get("/", async (req, res) => {
    //provide all the product categories
    res.status(200).json(await getAllproductCategories());
});

//get products into speicifc category
router.get("/:id/products", async (req, res) => {
    //provide all the product categories
    res.status(200).json([]);
});

module.exports = router;
