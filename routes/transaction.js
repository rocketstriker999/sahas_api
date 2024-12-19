const libExpress = require("express");
const libCrypto = require("crypto");
const { getUserByToken } = require("../db/users");
const { getProductForTransaction } = require("../db/products");
const { createTransaction, updateTransactionStatus, getTransactionDetails } = require("../db/transactions");
const { addAccess } = require("../db/accesses");
const { addInvoice } = require("../db/invoices");

const router = libExpress.Router();

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

router.get("/:productId", async (req, res) => {
    if (req.cookies.token) {
        const user = await getUserByToken(req.cookies.token);

        if (user) {
            if (req.params.productId) {
                const product = await getProductForTransaction(req.params.productId);
                const sgst = Number((product.discounted * 18) / 100),
                    cgst = sgst;

                const pay = product.discounted;

                //calculate gst and cgst values
                product.discounted = parseFloat(Number(product.discounted) - sgst - cgst).toFixed(2);

                const transactionId = await createTransaction({ ...product, sgst, cgst }, user.id);

                if (product && transactionId) {
                    const input = `${process.env.MERCHANT_KEY}|${transactionId}|${pay}|${product.title}|${user.name}|${user.email}|||||||||||${process.env.MERCHANT_SALT}`;
                    res.status(200).json({
                        product: { ...product, sgst, cgst, pay },
                        payment_gateway: {
                            success_url: process.env.TRANSACTION_SUCCESS_URL,
                            failure_url: process.env.TRANSACTION_FAILURE_URL,
                            hash: libCrypto.createHash("sha512").update(input).digest("hex"),
                            gateway_url: process.env.PAYU_URL,
                            merchant_key: process.env.MERCHANT_KEY,
                            transaction_id: transactionId,
                        },
                        user,
                    });
                } else {
                    res.status(400).json({ error: "Couldn't Create Transaction For This Product, Please Try again later" });
                }
            } else {
                res.status(400).json({ error: "Misisng Prodict Details" });
            }
        } else {
            res.status(401).json({ error: "Invalid Token" });
        }
    } else {
        res.status(401).json({ error: "Invalid Token" });
    }
});

module.exports = router;
