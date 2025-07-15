const libExpress = require("express");
const { creditUserWallet, getUserIdByEmail, getUserByTransactionId, getUserByToken, getUserById } = require("../db/users");
const { updateTransactionStatus, getTransactionById } = require("../db/transactions");
const { addAccess, addAccessTemp, getUserProductAccessData, getProfileUserProductAccessData, updateUserProductAccessStatus } = require("../db/accesses");
const { getDistributorByCouponCodeIdAndProductId, getCouponCodeIdByCouponCode, getCouponCodeById } = require("../db/coupon");
const { requestPayUVerification, requestService } = require("../utils");
const logger = require("../libs/logger");
const { getProductById } = require("../db/products");

const router = libExpress.Router();

//verify transaction and create new access
router.post("/", async (req, res) => {
    //get information
    if (req.body.txnid) {
        //we have transaction which is requested
        const transaction = await getTransactionById(req.body.txnid);
        const user = await getUserByTransactionId(transaction.id);
        const product = await getProductById(transaction.product_id);

        //verify with PAyu once
        if (await requestPayUVerification(transaction)) {
            //verified from payu
            updateTransactionStatus(transaction.id, "SUCCESS");
            //transaction updated - need to give access
            addAccess(transaction);
            //generate invoice as well
            requestService({
                requestServiceName: process.env.SERVICE_MEDIA,
                requestPath: "generate/invoice",
                requestMethod: "POST",
                requestPostBody: {
                    transaction,
                    user,
                    product,
                    percent_sgst: process.env.SGST,
                    percent_cgst: process.env.CGST,
                },
                onResponseReceieved: (_, responseCode) => {
                    if (responseCode === 201) {
                        //send email
                        requestService({
                            requestServiceName: process.env.SERVICE_MAILER,
                            requestPath: "invoice",
                            requestMethod: "POST",
                            requestPostBody: {
                                to: req.body.email,
                                body_paramters: {
                                    user_name: user?.name,
                                    product_title: product?.title,
                                    pay: transaction?.pay,
                                    invoice: `${process.env.CURRENT_DOMAIN}/${process.env.SERVICE_MEDIA}/invoices/${transaction?.invoice}`,
                                },
                            },
                        });
                    }
                },
                onRequestFailure: (error) => {
                    logger.error(`Failed To generate Invoice for transcation - ${transaction.id} error - ${error}`);
                },
            });

            //credit this to user's wallet money whoes code was used
            if (
                (couponCode =
                    (await getCouponCodeById(transaction.coupon_id)) &&
                    (couponCodeDistribution = await getDistributorByCouponCodeIdAndProductId(transaction.coupon_id, transaction.product_id)))
            ) {
                const couponCodeDistributor = await getUserById(couponCodeDistribution?.user_id);

                const commision =
                    couponCodeDistribution.commision_type === "PERCENTAGE"
                        ? (transaction.pay * couponCodeDistribution.commision) / 100
                        : couponCodeDistribution.commision;

                creditUserWallet(couponCodeDistribution.user_id, commision);

                logger.info("COUPON CODE");
                logger.info(JSON.stringify(couponCode));
                logger.info(couponCode);

                console.log(couponCode);
                console.log(JSON.stringify(couponCode));

                requestService({
                    requestServiceName: process.env.SERVICE_MAILER,
                    requestPath: "commision",
                    requestMethod: "POST",
                    requestPostBody: {
                        to: couponCodeDistributor?.email,
                        body_paramters: {
                            coupon_code_distributor_name: user?.name,
                            commision,
                            coupon_code: couponCode?.coupon_code,
                            user_name: user?.name,
                            user_email: user?.email,
                            updated_at: transaction?.updated_at,
                            product_title: product?.title,
                        },
                    },
                });
            }

            return res.redirect(`/products/${transaction.product_id}`);
        }
    }
    res.redirect(`/forbidden`);
});

//Get User Product Access by user id
router.get("/:id/getProfileUserProductAccess", async (req, res) => {
    if (req.params.id && req.cookies.token) {
        const user = await getUserByToken(req.cookies.token);
        if (user) {
            return res.status(200).json(await getProfileUserProductAccessData(user.id));
        }
        console.log(res.status(200).json(await getProfileUserProductAccessData(user.id)));
    }
    return res.status(401).json({ error: "Missing Required Information" });
});

//Need to remove this router it is temporary
router.post("/temp-addUserProductAccess", async (req, res) => {
    try {
        const { email, product_id, validity, company } = req.body;

        // Validate input
        if (!email || !product_id || !validity || !company) {
            return res.status(400).json({ error: "Email and product ID and validity and company are required." });
        }

        // Call function to add access
        const result = await addAccessTemp({ user_id: await getUserIdByEmail(email), product_id, company, id: null, validity });

        if (result) {
            return res.status(201).json({ message: "Access granted successfully!" });
        } else {
            return res.status(500).json({ error: "Failed to grant access." });
        }
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
});

//temp
router.get("/temp-getUserProductAccess", async (req, res) => {
    try {
        const transactions = await getUserProductAccessData(req.query);
        return res.status(200).json(transactions);
    } catch (error) {
        console.error("User Product Access error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

//temp
router.post("/temp-updateUserProductAccessStatus", async (req, res) => {
    const { userProductAccessId, active } = req.body;
    console.log(req.body);
    try {
        const result = await updateUserProductAccessStatus(userProductAccessId, active);
        return res.status(200).json({ result, message: "Status updated successfully" });
    } catch (error) {
        console.error("Error updating user product access status:", error);
        return res.status(500).json({ error: "User Product Activation Status not updated" });
    }
});

module.exports = router;
