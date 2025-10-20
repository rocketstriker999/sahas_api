const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { addCouponCodeCourse, getCouponCodeCoursesByIds } = require("../db/coupon_code_courses");
const router = libExpress.Router();
const logger = require("../libs/logger");

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["course_ids", "discount", "discount_type"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const { course_ids: courseIds, ...rest } = validatedRequestBody;

        const couponCodeCourseIds = await Promise.all(courseIds.map(({ id }) => addCouponCodeCourse({ course_id: id, ...rest })));

        res.status(201).json(await getCouponCodeCoursesByIds({ ids: couponCodeCourseIds.join(",") }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
