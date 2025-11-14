const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { addEnrollmentTransaction, getEnrollmentTransactionById, updateEnrollmentTransactionInvoiceById } = require("../db/enrollment_transactions");
const { readConfig } = require("../libs/config");
const { requestService } = require("sahas_utils");
const router = libExpress.Router();
const libNumbersToWords = require("number-to-words");
const { getEnrollmentCoursesByEnrollmentId } = require("../db/enrollment_courses");
const { getEnrollmentById } = require("../db/enrollments");
const { getUserById } = require("../db/users");
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
                    course_title: enrollmentCourses.map({ title }).join(","), //

                    user_name: `${enrollmentUser?.firstName} ${enrollmentUser?.lastName}`, //
                    user_email: enrollmentUser?.email, //
                    user_phone: enrollmentUser?.phone, //
                    validity: getFormattedDate({ date: enrollment?.end_date, format: "DD-MM-YY" }), //

                    payment_date: getFormattedDate({ date: enrollmentTransaction.created_on, format: "DD-MM-YY HH:mm:ss" }), //
                    cgst_percentage: cgst, //
                    sgst_percentage: sgst, //
                    price_original: enrollmentTransaction?.original, //
                    price_pre_tax: enrollmentTransaction?.amount, //
                    discount: enrollmentTransaction?.discount, //
                    coupon_code: "No Coupon Code", //
                    total_tax: (Number(enrollmentTransaction?.cgst) + Number(enrollmentTransaction?.sgst)).toFixed(2), //
                    cgst: enrollmentTransaction?.cgst, //
                    sgst: enrollmentTransaction?.sgst, //
                    price_pay: validatedRequestBody?.amount, //
                    price_pay_words: libNumbersToWords.toWords(validatedRequestBody?.amount).toUpperCase(), //
                },
            },
            onResponseReceieved: (generatedInvoice, responseCode) => {
                if (generatedInvoice?.cdn_url && responseCode === 201) {
                    logger.success(`Invoice For Transaction - ${enrollmentTransactionId} Generated !`);
                    updateEnrollmentTransactionInvoiceById({ id: enrollmentTransactionId, invoice: generatedInvoice.cdn_url });
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
