const libExpress = require("express");
const { getCourseById } = require("../db/courses");
const { validateRequestBody } = require("../utils");
const libCrypto = require("crypto");

const router = libExpress.Router();

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["courseId"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    //if already existing enrollment is there then do not give back the payment hash

    if (isRequestBodyValid) {
        const course = await getCourseById({ id: validatedRequestBody.courseId });

        const paymentGateWayPayLoad = {
            course,
            paymentGateWay: {
                merchantKey: process.env.MERCHANT_KEY,
                url: process.env.PAYU_URL,
            },
            transaction: {
                id: libCrypto.randomUUID(),
                successURL: process.env.TRANSACTION_SUCCESS_URL,
                failureURL: process.env.TRANSACTION_FAILURE_URL,

                sgst: (course.fees * Number(process.env.SGST)) / 100,
                cgst: (course.fees * Number(process.env.CGST)) / 100,

                walletDeduction: !!validatedRequestBody?.useWalletBalance ? 12 : 0,

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

        paymentGateWayPayLoad.transaction.original =
            paymentGateWayPayLoad.transaction.amount - (paymentGateWayPayLoad.transaction.sgst + paymentGateWayPayLoad.transaction.cgst);

        if (validatedRequestBody?.useWalletBalance && Number(req.user.wallet) > 0) {
            paymentGateWayPayLoad.transaction.amount = Math.max(Number(paymentGateWayPayLoad.transaction.amount) - Number(req.user.wallet), 0);
        }

        paymentGateWayPayLoad.transaction.hash = libCrypto
            .createHash("sha512")
            .update(
                `${paymentGateWayPayLoad.paymentGateWay.merchantKey}|${paymentGateWayPayLoad.transaction.id}|${paymentGateWayPayLoad.transaction.amount}|${paymentGateWayPayLoad.product}|${paymentGateWayPayLoad.user.firstName}|${paymentGateWayPayLoad.user.email}|||||||||||${process.env.MERCHANT_SALT}`
            )
            .digest("hex");

        //add transcation in to table

        res.status(201).json(paymentGateWayPayLoad);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
