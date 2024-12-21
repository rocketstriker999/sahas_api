const libExpress = require("express");
const libCrypto = require("crypto");
const { getUserByToken } = require("../db/users");
const { getProductForTransaction } = require("../db/products");
const { createTransaction, updateTransactionStatus, getTransactionDetails } = require("../db/transactions");
const { addAccess } = require("../db/accesses");
const { addInvoice } = require("../db/invoices");

const router = libExpress.Router();

//verify transaction and create new access
router.post("/", async (req, res) => {
    //receiev information
    if (req.body.mihpayid && req.body.txnid && req.body.productinfo) {
        //Need to Verify the transaction from payu as well
        const transactionIdPayu = req.body.mihpayid;
        const transactionIdSahas = req.body.txnid;

        const transaction = await getTransactionDetails(transactionIdSahas);

        if (transaction && (await updateTransactionStatus(transactionIdSahas, req.body.status))) {
            //transaction updated - need to give access
            await addAccess(transaction);
            await addInvoice(transaction.id);
            res.redirect(`/products/${transaction.product_id}/courses`);
        } else {
            res.redirect(`/purchase/${transaction.product_id}`);
        }
    } else {
        res.redirect(`/forbidden`);
    }
});

module.exports = router;
