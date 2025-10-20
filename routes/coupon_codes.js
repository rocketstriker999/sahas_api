const libExpress = require("express");
const { getAllCouponCodes, deleteCouponCodeById, addCouponCode, getCouponCodeById } = require("../db/coupon_codes");
const { validateRequestBody } = require("../utils");
const router = libExpress.Router();

//tested
router.get("/", async (req, res) => {
    //provide all the coupon Codes $#
    res.status(200).json(await getAllCouponCodes());
});

//tested
router.delete("/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Coupon Code Id" });
    }
    //delete coupon code
    deleteCouponCodeById({ id: req.params.id });
    //COUPON_CODE_COURSES also needed to be deleted
    res.sendStatus(204);
});

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["code"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const couponCodeId = await addCouponCode(validatedRequestBody);
        res.status(201).json(await getCouponCodeById({ id: couponCodeId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
