const libExpress = require("express");
const { getCourseById } = require("../db/courses");
const { verifyPaymentGatewayPayLoadStatus, getDateByInterval, getFormattedDate } = require("../utils");
const { requestService } = require("sahas_utils");
const { validateRequestBody } = require("sahas_utils");
const libCrypto = require("crypto");
const { readConfig } = require("../libs/config");
const { addPaymentGateWayPayLoad, removePaymentGateWayPayLoadsByIds, getAllNonVerifiedPaymentGateWayPayLoads } = require("../db/payment_gateway_payloads");
const { logger } = require("sahas_utils");
const { getCouponCodeCourseByCouponCodeAndCourseId } = require("../db/coupon_code_courses");
const { addEnrollment } = require("../db/enrollments");
const libMoment = require("moment");
const { addEnrollmentCourse } = require("../db/enrollment_courses");
const { addEnrollmentTransaction, updateEnrollmentTransactionInvoiceById } = require("../db/enrollment_transactions");
const { addWalletTransaction, getWalletBalanceByUserId } = require("../db/wallet_transactions");
const { getUserByEmail } = require("../db/users");
const libNumbersToWords = require("number-to-words");
const { getBundledCoursesByCourseId } = require("../db/bundled_courses");

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
        paymentGateWayPayLoad.transaction.discount = 0;
        paymentGateWayPayLoad.transaction.couponCode = validatedRequestBody?.couponCode || null;

        if (!!paymentGateWayPayLoad?.transaction?.couponCode) {
            if (
                (couponCodeCourse = await getCouponCodeCourseByCouponCodeAndCourseId({
                    code: paymentGateWayPayLoad.transaction.couponCode,
                    course_id: course?.id,
                }))
            ) {
                //if having discount
                if (couponCodeCourse?.discount > 0) {
                    paymentGateWayPayLoad.transaction.discount = Number(couponCodeCourse?.discount);
                    if (couponCodeCourse?.discount_type === "%") {
                        paymentGateWayPayLoad.transaction.discount = (paymentGateWayPayLoad.transaction.amount * couponCodeCourse.discount) / 100;
                    }
                    paymentGateWayPayLoad.transaction.discount = paymentGateWayPayLoad.transaction.discount.toFixed(2);
                }

                //if coupon code is there that means we will pick validity from there - default 365
                paymentGateWayPayLoad.course.validity =
                    couponCodeCourse.validity_type === "DAYS" ? getDateByInterval({ days: couponCodeCourse.validity_days }) : couponCodeCourse.validity_date;
                //if we have coupon code distributor commision is there
                //it will also check if given email is correct or not
                if (
                    !!couponCodeCourse.distributor_email &&
                    !!couponCodeCourse.commision &&
                    (distributorUser = await getUserByEmail({ email: couponCodeCourse.distributor_email }))
                ) {
                    paymentGateWayPayLoad.transaction.distributor_user = distributorUser;
                    paymentGateWayPayLoad.transaction.commision = couponCodeCourse.commision;

                    if (couponCodeCourse?.commision_type === "%") {
                        paymentGateWayPayLoad.transaction.commision = (paymentGateWayPayLoad.course.fees * couponCodeCourse.discount) / 100;
                    }
                }
            }

            paymentGateWayPayLoad.transaction.amount -= Number(paymentGateWayPayLoad.transaction.discount);
        }

        //if use wallet is required
        if (validatedRequestBody?.useWalletBalance && paymentGateWayPayLoad?.user?.wallet > 0 && paymentGateWayPayLoad.transaction.amount > 0) {
            paymentGateWayPayLoad.transaction.usedWalletBalance = Math.min(
                paymentGateWayPayLoad?.user?.wallet,
                paymentGateWayPayLoad.transaction.amount,
            ).toFixed(2);

            paymentGateWayPayLoad.transaction.amount = Math.max(
                paymentGateWayPayLoad.transaction.amount - paymentGateWayPayLoad.transaction.usedWalletBalance,
                0,
            );
        }

        //add cgst and sgst
        paymentGateWayPayLoad.transaction.cgst = ((paymentGateWayPayLoad.transaction.amount * cgst) / 100).toFixed(2);
        paymentGateWayPayLoad.transaction.sgst = ((paymentGateWayPayLoad.transaction.amount * sgst) / 100).toFixed(2);

        //pre tax amount
        paymentGateWayPayLoad.transaction.preTaxAmount =
            Number(paymentGateWayPayLoad.transaction.amount.toFixed(2)) -
            (Number(paymentGateWayPayLoad.transaction.cgst) + Number(paymentGateWayPayLoad.transaction.sgst));

        //final amount
        paymentGateWayPayLoad.transaction.amount = (
            Number(paymentGateWayPayLoad.transaction.preTaxAmount) +
            Number(paymentGateWayPayLoad.transaction.sgst) +
            Number(paymentGateWayPayLoad.transaction.cgst)
        ).toFixed(2);

        //hash generation
        paymentGateWayPayLoad.transaction.hash = libCrypto
            .createHash("sha512")
            .update(
                `${merchantKey}|${paymentGateWayPayLoad.transaction.id}|${paymentGateWayPayLoad.transaction.amount}|${paymentGateWayPayLoad.product}|${paymentGateWayPayLoad.user.firstName}|${paymentGateWayPayLoad.user.email}|||||||||||${merchantSalt}`,
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

    //get config before we check all transcations
    const { payment: { cgst, sgst } = {} } = await readConfig("app");

    //verify status with payment gateway
    const verifiedPaymentGatewayPayLoads = await Promise.all(getAllNonVerifiedPaymentGateWayPayLoads()?.map(verifyPaymentGatewayPayLoadStatus));
    //find those payment gateway payloads with success status
    const paidPaymentGatewayPayLoads = verifiedPaymentGatewayPayLoads?.filter(({ transaction }) => transaction?.paid);

    // process those payloads which are paid succesfully
    await Promise.all(
        paidPaymentGatewayPayLoads?.map(async (paymentGateWayPayLoad) => {
            //hold the date for different purpose
            paymentGateWayPayLoad.transaction.date_time = libMoment();

            // add Enrollment
            const enrollmentId = await addEnrollment({
                user_id: req?.user?.id,
                start_date: getFormattedDate({ date: paymentGateWayPayLoad.transaction.date_time }),
                end_date: getFormattedDate({ date: paymentGateWayPayLoad?.course?.validity }),
                amount: paymentGateWayPayLoad?.transaction?.amount,
                on_site_access: false,
                digital_access: true,
                created_by: req?.user?.id,
            });

            let enrollmentCourses = [paymentGateWayPayLoad?.course];

            //add course for it
            if (!!paymentGateWayPayLoad?.course?.is_bundle) {
                enrollmentCourses = await getBundledCoursesByCourseId({ course_id: paymentGateWayPayLoad?.course?.id });
            }

            for (const enrollmentCourse of enrollmentCourses)
                await addEnrollmentCourse({ created_by: req?.user?.id, enrollment_id: enrollmentId, course_id: enrollmentCourse?.id });

            //add transaction for it
            const enrollmentTransactionId = await addEnrollmentTransaction({
                enrollment_id: enrollmentId,
                amount: paymentGateWayPayLoad?.transaction?.amount,
                cgst: paymentGateWayPayLoad?.transaction?.cgst,
                sgst: paymentGateWayPayLoad?.transaction?.sgst,
                created_by: req?.user?.id,
                coupon_code: paymentGateWayPayLoad?.transaction?.couponCode,
                discount: paymentGateWayPayLoad?.transaction?.discount,
                note: "Self Purchased",
                type: "PAYMENT_GATEWAY",
            });

            //deduct wallet if used
            if (paymentGateWayPayLoad?.transaction?.usedWalletBalance) {
                await addWalletTransaction({
                    user_id: req?.user?.id,
                    amount: -paymentGateWayPayLoad?.transaction?.usedWalletBalance,
                    note: `Course Purchase - ${paymentGateWayPayLoad?.course?.title}`,
                    created_by: req?.user?.id,
                });
            }

            //add distributor's commision
            if (
                !!paymentGateWayPayLoad?.transaction?.couponCode &&
                !!paymentGateWayPayLoad?.transaction?.distributor_user &&
                !!paymentGateWayPayLoad?.transaction?.commision
            ) {
                await addWalletTransaction({
                    user_id: paymentGateWayPayLoad.transaction.distributor_user.id,
                    amount: paymentGateWayPayLoad.transaction.commision,
                    note: `Coupon Distribution Benifit - ${paymentGateWayPayLoad.transaction.couponCode} - ${paymentGateWayPayLoad?.user?.email}`,
                    created_by: req?.user?.id,
                });

                await requestService({
                    requestServiceName: process.env.SERVICE_MAILER,
                    onRequestStart: () => logger.info("Sending Coupon Code Commision Email"),
                    requestMethod: "POST",
                    parseResponseBody: false,
                    requestPostBody: {
                        to: paymentGateWayPayLoad?.transaction.distributor_user?.email,
                        subject: "Coupon Code Used",
                        template: "commision",
                        injects: {
                            distributor_name: paymentGateWayPayLoad?.transaction?.distributor_user?.full_name,
                            commision: paymentGateWayPayLoad?.transaction?.commision,
                            coupon_code: paymentGateWayPayLoad?.transaction?.couponCode,
                            user_name: `${paymentGateWayPayLoad?.user?.firstName} ${paymentGateWayPayLoad?.user?.lastName}`,
                            user_email: paymentGateWayPayLoad?.user?.email,
                            used_at: getFormattedDate({ date: paymentGateWayPayLoad.transaction.date_time, format: "DD-MM-YY HH:mm:ss" }),
                            course_title: paymentGateWayPayLoad?.course?.title,
                        },
                    },
                    onResponseReceieved: (_, responseCode) => {
                        if (responseCode === 201) {
                            logger.success(`Enrollment Email Sent`);
                        } else {
                            logger.error(`Failed To Send Enrollment Email`);
                        }
                    },
                });
            }

            //generate invoice
            await requestService({
                requestServiceName: process.env.SERVICE_MEDIA,
                onRequestStart: () => logger.info("Generating Invoice"),
                requestPath: "templated/pdf",
                requestMethod: "POST",
                requestPostBody: {
                    template: "invoice",
                    injects: {
                        invoice_date: getFormattedDate({ date: paymentGateWayPayLoad.transaction.date_time, format: "DD-MM-YY" }),
                        transaction_id: enrollmentTransactionId,
                        course_title: paymentGateWayPayLoad?.course?.title,
                        user_name: `${paymentGateWayPayLoad?.user?.firstName} ${paymentGateWayPayLoad?.user?.lastName}`,
                        user_email: paymentGateWayPayLoad?.user?.email,
                        user_phone: paymentGateWayPayLoad?.user?.phone,
                        validity: getFormattedDate({ date: paymentGateWayPayLoad?.course?.validity, format: "DD-MM-YY" }),
                        payment_date: getFormattedDate({ date: paymentGateWayPayLoad.transaction.date_time, format: "DD-MM-YY HH:mm:ss" }),
                        cgst_percentage: cgst,
                        sgst_percentage: sgst,
                        price_original: paymentGateWayPayLoad?.course?.fees,
                        price_pre_tax: paymentGateWayPayLoad?.transaction?.preTaxAmount,
                        discount: paymentGateWayPayLoad?.transaction?.discount,
                        coupon_code: paymentGateWayPayLoad?.transaction?.couponCode || "No Coupon Code",
                        total_tax: (Number(paymentGateWayPayLoad?.transaction?.cgst) + Number(paymentGateWayPayLoad?.transaction?.sgst)).toFixed(2),
                        cgst: paymentGateWayPayLoad?.transaction?.cgst,
                        sgst: paymentGateWayPayLoad?.transaction?.sgst,
                        price_pay: paymentGateWayPayLoad?.transaction?.amount,
                        price_pay_words: libNumbersToWords.toWords(paymentGateWayPayLoad?.transaction?.amount).toUpperCase(),
                        received_by: "PayU",
                        mode_payment: "Online",
                        note: "NA",
                    },
                },
                onResponseReceieved: (generatedInvoice, responseCode) => {
                    if (generatedInvoice?.cdn_url && responseCode === 201) {
                        logger.success(`Invoice For Transaction - ${enrollmentTransactionId} Generated !`);
                        paymentGateWayPayLoad.transaction.invoice = generatedInvoice.cdn_url;
                        updateEnrollmentTransactionInvoiceById({ id: enrollmentTransactionId, invoice: generatedInvoice.cdn_url });
                    } else {
                        logger.error(
                            `Failed To Generate Invoice For Transaction - ${enrollmentTransactionId} - Media Responded With ${JSON.stringify(generatedInvoice)}`,
                        );
                    }
                },
            });

            //send notification emails
            await requestService({
                requestServiceName: process.env.SERVICE_MAILER,
                onRequestStart: () => logger.info("Sending Enrollment Transcation Email"),
                requestMethod: "POST",
                parseResponseBody: false,
                requestPostBody: {
                    to: paymentGateWayPayLoad?.user?.email,
                    subject: "Course Enrollment Transaction",
                    template: "enrollment",
                    injects: {
                        user_name: `${paymentGateWayPayLoad?.user?.firstName} ${paymentGateWayPayLoad?.user?.lastName}`,
                        course_title: paymentGateWayPayLoad?.course?.title,
                        amount: paymentGateWayPayLoad?.transaction?.amount,
                        invoice: paymentGateWayPayLoad.transaction.invoice,
                    },
                },
                onResponseReceieved: (_, responseCode) => {
                    if (responseCode === 201) {
                        logger.success(`Enrollment Email Sent`);
                    } else {
                        logger.error(`Failed To Send Enrollment Email`);
                    }
                },
            });
        }),
    );

    const paymentGateWayPayLoad = { ...verifiedPaymentGatewayPayLoads?.find(({ transaction }) => transaction?.id == req.params.id) };

    res.status(200).json({ transaction: { paid: paymentGateWayPayLoad?.transaction?.paid }, course: paymentGateWayPayLoad?.course });
});

module.exports = router;
