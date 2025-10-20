const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { addCouponCodeCourse } = require("../db/coupon_code_courses");
const router = libExpress.Router();
const logger = require("../libs/logger");

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["course_ids", "discount", "discount_type"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const { course_ids: courseIds, ...rest } = validatedRequestBody;

        const ids = await Promise.all(courseIds.map(({ id }) => addCouponCodeCourse({ course_id: id, ...rest })));

        logger.info(ids);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
