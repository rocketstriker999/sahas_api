const libExpress = require("express");
const { getCourseById } = require("../db/courses");
const { validateRequestBody, verifyPaymentGatewayPayLoadStatus, getDateByInterval, getFormattedDate } = require("../utils");
const libCrypto = require("crypto");
const { readConfig } = require("../libs/config");
const { addPaymentGateWayPayLoad, getAllPaymentGateWayPayLoads, removePaymentGateWayPayLoadsByIds } = require("../db/payment_gateway_payloads");
const logger = require("../libs/logger");
const { getCouponCodeCourseByCouponCodeAndCourseId } = require("../db/coupon_code_courses");
const { addEnrollment } = require("../db/enrollments");
const libMoment = require("moment");
const { addEnrollmentCourse } = require("../db/enrollment_courses");
const { addEnrollmentTransaction } = require("../db/enrollment_transactions");
const { addWalletTransaction, getWalletBalanceByUserId } = require("../db/wallet_transactions");

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
            course: { ...course, validity: getDateByInterval({ days: course?.validity }) },
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
                wallet: (await getWalletBalanceByUserId({ user_id: req?.user?.id })).toFixed(2),
            },
            product: course.title,
        };

        //calculate coupon code first
        if (validatedRequestBody.couponCode) {
            paymentGateWayPayLoad.transaction.couponCode = validatedRequestBody.couponCode;

            if ((couponCodeCourse = await getCouponCodeCourseByCouponCodeAndCourseId({ code: validatedRequestBody.couponCode, course_id: course?.id }))) {
                //if having discount
                if (couponCodeCourse?.discount > 0) {
                    paymentGateWayPayLoad.transaction.discount = Number(couponCodeCourse?.discount);
                    if (couponCodeCourse?.discount_type === "%") {
                        paymentGateWayPayLoad.transaction.discount = (paymentGateWayPayLoad.transaction.amount * couponCodeCourse.discount) / 100;
                    }
                    paymentGateWayPayLoad.transaction.discount = paymentGateWayPayLoad.transaction.discount.toFixed(2);
                }

                //if we have coupon code having validity as well
                if (!!couponCodeCourse.validity) {
                    paymentGateWayPayLoad.course.validity =
                        couponCodeCourse.validity_type === "EXTEND"
                            ? getDateByInterval({ baseDate: paymentGateWayPayLoad.course.validity, days: couponCodeCourse.validity })
                            : getDateByInterval({ days: couponCodeCourse.validity });
                }
            } else {
                paymentGateWayPayLoad.transaction.discount = 0;
            }

            paymentGateWayPayLoad.transaction.amount -= Number(paymentGateWayPayLoad.transaction.discount);
        }

        //if use wallet is required
        if (validatedRequestBody?.useWalletBalance && paymentGateWayPayLoad?.user?.wallet > 0 && paymentGateWayPayLoad.transaction.amount > 0) {
            paymentGateWayPayLoad.transaction.usedWalletBalance = Math.min(
                paymentGateWayPayLoad?.user?.wallet,
                paymentGateWayPayLoad.transaction.amount
            ).toFixed(2);
            logger.info(paymentGateWayPayLoad.transaction.amount);

            paymentGateWayPayLoad.transaction.amount = Math.max(
                paymentGateWayPayLoad.transaction.amount - paymentGateWayPayLoad.transaction.usedWalletBalance,
                0
            );

            logger.info(paymentGateWayPayLoad.transaction.amount);
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
            // add Enrollment
            const enrollmentId = await addEnrollment({
                user_id: req?.user?.id,
                start_date: getFormattedDate({ date: libMoment() }),
                end_date: getFormattedDate({ date: paymentGateWayPayLoad?.course?.validity }),
                amount: paymentGateWayPayLoad?.transaction?.amount,
                on_site_access: false,
                digital_access: true,
                created_by: req?.user?.id,
            });

            //add course for it
            await addEnrollmentCourse({ created_by: req?.user?.id, enrollment_id: enrollmentId, course_id: paymentGateWayPayLoad?.course?.id });

            //add transaction for it
            await addEnrollmentTransaction({
                enrollment_id: enrollmentId,
                amount: paymentGateWayPayLoad?.transaction?.amount,
                cgst: paymentGateWayPayLoad?.transaction?.cgst,
                sgst: paymentGateWayPayLoad?.transaction?.sgst,
                created_by: req?.user?.id,
                note: "Self Purchased",
                type: "PAYMENT_GATEWAY",
            });

            //deduct wallet if used
            if (paymentGateWayPayLoad?.transaction?.usedWalletBalance) {
                addWalletTransaction({
                    user_id: req?.user?.id,
                    amount: -paymentGateWayPayLoad?.transaction?.usedWalletBalance,
                    note: `Course Purchase - ${paymentGateWayPayLoad?.course?.title}`,
                    created_by: req?.user?.id,
                });
            }

            //add analytics for coupon code usage

            //add distributor's commision

            //generate invoice
        })
    );

    //remove all the payloads which are verified and processed
    removePaymentGateWayPayLoadsByIds({ ids: verifiedPaymentGatewayPayLoads?.map(({ transaction }) => transaction?.id) });

    res.status(200).json(verifiedPaymentGatewayPayLoads?.find(({ transaction }) => transaction?.id == req.params.id));
});

module.exports = router;
