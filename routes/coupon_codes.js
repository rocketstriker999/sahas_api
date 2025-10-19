const libExpress = require("express");
const { getAllCouponCodes, deleteCouponCodeById } = require("../db/coupon_codes");
const router = libExpress.Router();

//tested
router.get("/", async (req, res) => {
    //provide all the coupon Codes
    res.status(200).json(await getAllCouponCodes());
});

//tested
router.delete("/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Coupon Code Id" });
    }
    //delete chapter Type
    deleteCouponCodeById({ id: req.params.id });
    res.sendStatus(204);
});

module.exports = router;
