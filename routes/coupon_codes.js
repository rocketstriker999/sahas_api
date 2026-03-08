const libExpress = require("express");
const { getAllCouponCodes, deleteCouponCodeById, addCouponCode, getCouponCodeById, updateCouponCodeById } = require("../db/coupon_codes");
const { validateRequestBody } = require("sahas_utils");
const { getCouponCodeCoursesByCouponCodeId } = require("../db/coupon_code_courses");
const requires_authority = require("../middlewares/requires_authority");
const { AUTHORITIES } = require("../constants");

const router = libExpress.Router();

//tested
router.get("/", requires_authority(AUTHORITIES.READ_COUPON_CODE), async (req, res) => {
    //provide all the coupon Codes
    res.status(200).json(await getAllCouponCodes());
});

//tested
router.get("/:id/courses", requires_authority(AUTHORITIES.READ_COUPON_CODE), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Coupon Code Id" });
    }
    //provide all the coupon Codes
    res.status(200).json(await getCouponCodeCoursesByCouponCodeId({ coupon_code_id: req.params.id }));
});

//tested
router.delete("/:id", requires_authority(AUTHORITIES.DELETE_COUPON_CODE), (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Coupon Code Id" });
    }
    //delete coupon code
    deleteCouponCodeById({ id: req.params.id });
    //COUPON_CODE_COURSES also needed to be deleted
    res.sendStatus(204);
});

//tested
router.patch("/", requires_authority(AUTHORITIES.UPDATE_COUPON_CODE), async (req, res) => {
    const requiredBodyFields = ["id", "code", "active"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateCouponCodeById(validatedRequestBody);
        res.status(200).json(await getCouponCodeById({ id: validatedRequestBody.id }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.post("/", requires_authority(AUTHORITIES.CREATE_COUPON_CODE), async (req, res) => {
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
