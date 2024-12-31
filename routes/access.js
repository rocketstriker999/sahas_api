const libExpress = require("express");
const libCrypto = require("crypto");
const { creditCuponReward } = require("../db/users");
const { updateTransactionStatus, getTransactionById } = require("../db/transactions");
const { addAccess } = require("../db/accesses");
const { addInvoice } = require("../db/invoices");
const { validateCouponCode } = require("../db/coupon");

const router = libExpress.Router();

//verify transaction and create new access
router.post("/", async (req, res) => {
    //receiev information
    if (req.body.mihpayid && req.body.txnid && req.body.productinfo) {
        //Need to Verify the transaction from payu as well
        const transactionIdPayu = req.body.mihpayid;
        const transactionIdSahas = req.body.txnid;

        const transaction = await getTransactionById(transactionIdSahas);

        if (transaction && (await updateTransactionStatus(transactionIdSahas, req.body.status))) {
            //transaction updated - need to give access
            await addAccess(transaction);
            //geenrate invoice as well
            addInvoice(transaction.id);
            //Need to give benifit - if coupon was used
            if (
                (appliedCoupon = await validateCouponCode(transaction.coupon, transaction.product_id)) &&
                appliedCoupon.benifit_value > 0 &&
                appliedCoupon.beneficiary_user_id > 0
            ) {
                //credit this to user's wallet money
                creditCuponReward(
                    appliedCoupon.beneficiary_user_id,
                    appliedCoupon.benifit_type === "PERCENTAGE" ? (transaction.pay * appliedCoupon.benifit_value) / 100 : appliedCoupon.benifit_value
                );
            }

            res.redirect(`/products/${transaction.product_id}/courses`);
        } else {
            res.redirect(`/purchase/${transaction.product_id}`);
        }
    } else {
        res.redirect(`/forbidden`);
    }
});

module.exports = router;
