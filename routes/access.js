const libExpress = require("express");
const { creditUserWallet, getUserIdByEmail, getUserByTransactionId } = require("../db/users");
const { updateTransactionStatus, getTransactionById } = require("../db/transactions");
const { addAccess, addAccessTemp, getAccessByTransactionId, getUserProductAccessData } = require("../db/accesses");
const { getDistributorByCouponCodeIdAndProductId } = require("../db/coupon");
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
                    user: await getUserByTransactionId(transaction.id),
                    product: await getProductById(transaction.product_id),
                    percent_sgst: process.env.SGST,
                    percent_cgst: process.env.CGST,
                },
                onResponseReceieved: () => {
                    //send email
                },
                onRequestFailure: (error) => {
                    logger.error(`Failed To generate Invoice for transcation - ${transaction.id} error - ${error}`);
                },
            });

            //credit this to user's wallet money whoes code was used
            if ((couponCodeDistributor = await getDistributorByCouponCodeIdAndProductId(transaction.coupon_id, transaction.product_id))) {
                creditUserWallet(
                    couponCodeDistributor.user_id,
                    couponCodeDistributor.commision_type === "PERCENTAGE"
                        ? (transaction.pay * couponCodeDistributor.commision) / 100
                        : couponCodeDistributor.commision
                );
            }

            return res.redirect(`/products/${transaction.product_id}`);
        }
    }
    res.redirect(`/forbidden`);
});

//Need to remove this router it is temporary
router.post("/temp-addUserProductAccess", async (req, res) => {
    try {
        const { email, product_id, validity } = req.body;

        // Validate input
        if (!email || !product_id || !validity) {
            return res.status(400).json({ error: "Email and product ID and validity are required." });
        }

        // Call function to add access
        const result = await addAccessTemp({ user_id: await getUserIdByEmail(email), product_id, id: null, validity });

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
        console.error("Transaction error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
