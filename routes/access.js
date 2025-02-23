const libExpress = require("express");
const { creditUserWallet, getUserIdByEmail } = require("../db/users");
const { updateTransactionStatus, getTransactionById } = require("../db/transactions");
const { addAccess } = require("../db/accesses");
const { addInvoice } = require("../db/invoices");
const { getDistributorByCouponCodeIdAndProductId } = require("../db/coupon");
const { requestPayUVerification } = require("../utils");
const logger = require("../libs/logger");

const router = libExpress.Router();

//verify transaction and create new access
router.post("/", async (req, res) => {
    //get information
    if (req.body.txnid) {
        //we have transaction which is requested
        const transaction = await getTransactionById(req.body.txnid);
        //verify with PAyu once
        const transactionVerification = await requestPayUVerification({ transaction, command: process.env.TRANSACTION_VERIFICATION_COMMAND });

        if (transactionVerification?.transaction_details[transaction.id]?.status === "success") {
            //verified from payu
            updateTransactionStatus(transaction.id, transactionVerification.transaction_details[transaction.id].status);
            //transaction updated - need to give access
            addAccess(transaction);
            //generate invoice as well
            addInvoice(transaction.id);

            logger.info(transaction.coupon_id);
            logger.info(transaction.product_id);

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
        const result = await addAccess({ user_id: await getUserIdByEmail(email), product_id, id: null, validity });

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

module.exports = router;
