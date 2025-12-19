const libExpress = require("express");
const { validateRequestBody, getFormattedDate, getDateByInterval, getDifferenceOfDates } = require("../utils");
const {
    addEnrollmentTransaction,
    getEnrollmentTransactionById,
    updateEnrollmentTransactionInvoiceById,
    getEnrollmentTransactionsForInterval,
} = require("../db/enrollment_transactions");
const { readConfig } = require("../libs/config");
const { requestService } = require("sahas_utils");
const router = libExpress.Router();
const libNumbersToWords = require("number-to-words");
const { getEnrollmentCoursesByEnrollmentId } = require("../db/enrollment_courses");
const { getEnrollmentById } = require("../db/enrollments");
const { getUserById } = require("../db/users");
const { logger } = require("sahas_utils");

router.get(
    "/",
    (req, res, next) => {
        if (!req.query.start_date || !req.query.end_date) {
            return res.status(400).json({ error: "Missing Start Date or End Date Range" });
        }

        const transactionsPeriod = getDifferenceOfDates({ start_date: req.query.start_date, end_date: req.query.end_date });

        if (transactionsPeriod > 180 || transactionsPeriod < 0) {
            return res.status(400).json({ error: "Date Range is Either Negative or Too Big" });
        }
        next();
    },
    async (req, res) => {
        const enrollmentTranscations = await getEnrollmentTransactionsForInterval({
            start_date: getFormattedDate({ date: req.query.start_date }),
            end_date: getFormattedDate({ date: req.query.end_date }),
            order_by: req.query?.order_by,
        });

        for (const enrollmentTranscation of enrollmentTranscations) {
            enrollmentTranscation.courses = await getEnrollmentCoursesByEnrollmentId({ enrollment_id: enrollmentTranscation?.enrollment_id });
        }

        res.status(200).json(enrollmentTranscations);
    }
);

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["enrollment_id", "amount", "note", "type"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const { payment: { cgst, sgst } = {} } = await readConfig("app");

        const enrollmentTransactionId = await addEnrollmentTransaction({
            ...validatedRequestBody,
            created_by: req.user.id,
            cgst: (validatedRequestBody?.amount * cgst) / (100 + cgst + sgst),
            sgst: (validatedRequestBody?.amount * sgst) / (100 + cgst + sgst),
        });

        const enrollment = await getEnrollmentById({ id: validatedRequestBody.enrollment_id });
        const enrollmentCourses = await getEnrollmentCoursesByEnrollmentId({ enrollment_id: validatedRequestBody.enrollment_id });
        const enrollmentTransaction = await getEnrollmentTransactionById({ id: enrollmentTransactionId });
        const enrollmentUser = await getUserById({ id: enrollment.user_id });

        //delete this
        logger.info(JSON.stringify(enrollment));
        logger.info(JSON.stringify(enrollmentCourses));
        logger.info(JSON.stringify(enrollmentTransaction));
        logger.info(JSON.stringify(enrollmentUser));

        //generate invoice
        await requestService({
            requestServiceName: process.env.SERVICE_MEDIA,
            onRequestStart: () => logger.info("Generating Invoice"),
            requestPath: "templated/pdf",
            requestMethod: "POST",
            requestPostBody: {
                template: "invoice",
                injects: {
                    invoice_date: getFormattedDate({ date: enrollmentTransaction.created_on, format: "DD-MM-YY" }), //
                    transaction_id: enrollmentTransactionId, //
                    course_title: enrollmentCourses.map(({ title }) => title).join(","), //

                    user_name: `${enrollmentUser?.full_name}`, //
                    user_email: enrollmentUser?.email, //
                    user_phone: enrollmentUser?.phone, //
                    validity: getFormattedDate({ date: enrollment?.end_date, format: "DD-MM-YY" }), //

                    payment_date: getFormattedDate({ date: enrollmentTransaction.created_on, format: "DD-MM-YY HH:mm:ss" }), //
                    cgst_percentage: cgst, //
                    sgst_percentage: sgst, //
                    price_original: enrollmentTransaction?.original, //
                    price_pre_tax: enrollmentTransaction?.original, //
                    discount: enrollmentTransaction?.discount, //
                    coupon_code: "No Coupon Code", //
                    total_tax: (Number(enrollmentTransaction?.cgst) + Number(enrollmentTransaction?.sgst)).toFixed(2), //
                    cgst: enrollmentTransaction?.cgst, //
                    sgst: enrollmentTransaction?.sgst, //
                    price_pay: validatedRequestBody?.amount, //
                    price_pay_words: libNumbersToWords.toWords(validatedRequestBody?.amount).toUpperCase(), //
                    received_by: req.user?.full_name,
                    mode_payment: enrollmentTransaction.type,
                    note: enrollmentTransaction.note,
                },
            },
            onResponseReceieved: (generatedInvoice, responseCode) => {
                if (generatedInvoice?.cdn_url && responseCode === 201) {
                    logger.success(`Invoice For Transaction - ${enrollmentTransactionId} Generated !`);
                    updateEnrollmentTransactionInvoiceById({ id: enrollmentTransactionId, invoice: generatedInvoice.cdn_url });
                    enrollmentTransaction.invoice = generatedInvoice.cdn_url;
                } else {
                    logger.error(
                        `Failed To Generate Invoice For Transaction - ${enrollmentTransactionId} - Media Responded With ${JSON.stringify(generatedInvoice)}`
                    );
                }
            },
        });

        res.status(201).json(enrollmentTransaction);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
