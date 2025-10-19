const libExpress = require("express");
const { getAllCouponCodes } = require("../db/coupon_codes");
const router = libExpress.Router();

//tested
router.get("/", async (req, res) => {
    //provide all the coupon Codes
    res.status(200).json(await getAllCouponCodes());
});

module.exports = router;
