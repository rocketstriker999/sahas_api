const libExpress = require("express");
const { creditUserWallet } = require("../db/users");
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
            logger.info("F!");

            //Need to give benifit - if coupon was used
            if ((couponCodeDistributor = await getDistributorByCouponCodeIdAndProductId(transaction.coupon_id, transactionVerification.product_id))) {
                //credit this to user's wallet money whoes code was used
                creditUserWallet(
                    couponCodeDistributor.user_id,
                    couponCodeDistributor.commision_type === "PERCENTAGE"
                        ? (transaction.pay * couponCodeDistributor.commision) / 100
                        : couponCodeDistributor.commision
                );
            }

            return res.redirect(`/products/${transaction.product_id}/courses`);
        }
    }
    res.redirect(`/forbidden`);
});

module.exports = router;
