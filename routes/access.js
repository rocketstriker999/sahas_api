const libExpress = require("express");
const { creditUserWallet } = require("../db/users");
const { updateTransactionStatus, getTransactionById } = require("../db/transactions");
const { addAccess } = require("../db/accesses");
const { addInvoice } = require("../db/invoices");
const { getBenificiaryByCouponIdAndProductId } = require("../db/coupon");
const { requestPayUVerification } = require("../utils");

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
            await updateTransactionStatus(transaction.id, transactionVerification.transaction_details[transaction.id].status);
            //transaction updated - need to give access
            await addAccess(transaction);
            //generate invoice as well
            addInvoice(transaction.id);

            //Need to give benifit - if coupon was used
            if ((benificary = await getBenificiaryByCouponIdAndProductId(transaction.coupon_id, transactionVerification.product_id))) {
                //credit this to user's wallet money whoes code was used
                creditUserWallet(benificar.user_id, benificar.benifit_type === "PERCENTAGE" ? (transaction.pay * benificar.benifit) / 100 : benificar.benifit);
            }

            return res.redirect(`/products/${transaction.product_id}/courses`);
        }
    }
    res.redirect(`/forbidden`);
});

module.exports = router;
