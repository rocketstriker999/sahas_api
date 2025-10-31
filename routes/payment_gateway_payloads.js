const libExpress = require("express");
const { getCourseById } = require("../db/courses");
const { validateRequestBody, verifyPaymentGatewayPayLoadStatus, getDateByInterval } = require("../utils");
const libCrypto = require("crypto");
const { readConfig } = require("../libs/config");
const { addPaymentGateWayPayLoad, getAllPaymentGateWayPayLoads, removePaymentGateWayPayLoadsByIds } = require("../db/payment_gateway_payloads");
const logger = require("../libs/logger");
const { getCouponCodeCourseByCouponCodeAndCourseId } = require("../db/coupon_code_courses");

const router = libExpress.Router();

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["courseId"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    const { payment: { cgst, sgst } = {}, paymentGateWay: { merchantKey, merchantSalt, redirectionHost, resultAPI, url } = {} } = await readConfig("app");

    //if already existing enrollment is there then do not give back the payment hash

    if (isRequestBodyValid) {
        const course = await getCourseById({ id: validatedRequestBody.courseId });

        const paymentGateWayPayLoad = {
            course: { ...course, validity: getDateByInterval(course?.validity) },
            paymentGateWay: {
                merchantKey,
                url,
            },
            transaction: {
                id: libCrypto.randomUUID(),
                successURL: redirectionHost.concat(resultAPI),
                failureURL: redirectionHost.concat(resultAPI),
                amount: Number(course.fees),
            },
            user: {
                email: req.user.email,
                firstName: req.user.full_name?.split(" ")[0],
                lastName: req.user.full_name?.split(" ")?.[1] || "NA",
                phone: req.user.phone,
                wallet: Number(req.user.wallet),
            },
            product: course.title,
        };

        //calculate coupon code first
        if (validatedRequestBody.couponCode) {
            paymentGateWayPayLoad.transaction.couponCode = validatedRequestBody.couponCode;

            if ((couponCodeCourse = await getCouponCodeCourseByCouponCodeAndCourseId({ code: validatedRequestBody.couponCode, course_id: course?.id }))) {
                paymentGateWayPayLoad.transaction.discount = couponCodeCourse?.discount;
                if (couponCodeCourse?.discount_type === "%") {
                    paymentGateWayPayLoad.transaction.discount = (paymentGateWayPayLoad.transaction.amount * couponCodeCourse.discount) / 100;
                }
                paymentGateWayPayLoad.transaction.discount = -paymentGateWayPayLoad.transaction.discount.toFixed(2);
                logger.info(paymentGateWayPayLoad.transaction.discount);
            } else {
                paymentGateWayPayLoad.transaction.discount = 0;
            }

            paymentGateWayPayLoad.transaction.amount += Number(paymentGateWayPayLoad.transaction.discount);
        }

        //if use wallet is required
        if (validatedRequestBody?.useWalletBalance && req.user.wallet > 0 && paymentGateWayPayLoad.transaction.amount > 0) {
            paymentGateWayPayLoad.transaction.usedWalletBalance = -Math.min(Number(req.user.wallet), Number(paymentGateWayPayLoad.transaction.amount));
            paymentGateWayPayLoad.transaction.amount = Math.max(
                paymentGateWayPayLoad.transaction.amount + paymentGateWayPayLoad.transaction.usedWalletBalance,
                0
            );
        }

        //pre tax amount
        paymentGateWayPayLoad.transaction.preTaxAmount = paymentGateWayPayLoad.transaction.amount.toFixed(2);

        //add cgst and sgst
        paymentGateWayPayLoad.transaction.cgst = ((paymentGateWayPayLoad.transaction.amount * cgst) / 100).toFixed(2);
        paymentGateWayPayLoad.transaction.sgst = ((paymentGateWayPayLoad.transaction.amount * sgst) / 100).toFixed(2);

        //final amount
        paymentGateWayPayLoad.transaction.amount = (
            Number(paymentGateWayPayLoad.transaction.amount) +
            Number(paymentGateWayPayLoad.transaction.sgst) +
            Number(paymentGateWayPayLoad.transaction.cgst)
        ).toFixed(2);

        //hash generation
        paymentGateWayPayLoad.transaction.hash = libCrypto
            .createHash("sha512")
            .update(
                `${merchantKey}|${paymentGateWayPayLoad.transaction.id}|${paymentGateWayPayLoad.transaction.amount}|${paymentGateWayPayLoad.product}|${paymentGateWayPayLoad.user.firstName}|${paymentGateWayPayLoad.user.email}|||||||||||${merchantSalt}`
            )
            .digest("hex");

        //add transcation in to table
        addPaymentGateWayPayLoad(paymentGateWayPayLoad);

        res.status(201).json(paymentGateWayPayLoad);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Payment GateWay PayLoad Id" });
    }

    //verify status with payment gateway
    const verifiedPaymentGatewayPayLoads = await Promise.all(getAllPaymentGateWayPayLoads()?.map(verifyPaymentGatewayPayLoadStatus));
    //find those payment gateway payloads with success status
    const paidPaymentGatewayPayLoads = verifiedPaymentGatewayPayLoads?.filter(({ transaction }) => transaction?.paid);

    // process those payloads which are paid succesfully
    await Promise.all(
        paidPaymentGatewayPayLoads?.map(async (paymentGateWayPayLoad) => {
            logger.info(JSON.stringify(paymentGateWayPayLoad));
        })
    );

    //remove all the payloads which are verified and processed
    removePaymentGateWayPayLoadsByIds({ ids: verifiedPaymentGatewayPayLoads?.map(({ transaction }) => transaction?.id) });

    res.status(200).json(verifiedPaymentGatewayPayLoads?.find(({ transaction }) => transaction?.id == req.params.id));
});

module.exports = router;
