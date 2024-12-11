const libExpress = require("express");
const libCrypto = require("crypto");
const { getUserByToken } = require("../db/users");
const { getProductForTransaction } = require("../db/products");
const { createTransaction, updateTransactionStatus, getTransactionDetails } = require("../db/transactions");
const { addAccess } = require("../db/accesses");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    //receiev information
    if (req.body.mihpayid && req.body.txnid && req.body.productinfo) {
        //Need to Verify the transaction from payu as well
        const transactionIdPayu = req.body.mihpayid;
        const transactionIdSahas = req.body.txnid;

        const transaction = await getTransactionDetails(transactionIdSahas);

        if (await updateTransactionStatus(transactionIdSahas, req.body.status)) {
            //transaction updated - need to give access
            addAccess(transaction);
            res.redirect(`/products/${req.body.productinfo}/courses`);
        } else {
            res.redirect(`/purchase/${req.body.productinfo}`);
        }
    } else {
        res.redirect(`/purchase/${req.body.productinfo}`);
    }
});

router.get("/:productId", async (req, res) => {
    if (req.cookies.token) {
        const user = await getUserByToken(req.cookies.token);

        if (user) {
            if (req.params.productId) {
                const product = await getProductForTransaction(req.params.productId);
                console.log(product);
                const sgst = (product.discounted * 18) / 100,
                    cgst = sgst;
                const pay = Number(product.discounted) + Number(sgst) + Number(cgst);
                const transactionId = await createTransaction({ ...product, sgst, cgst, pay }, user.id);
                if (product && transactionId) {
                    const input = `${process.env.MERCHANT_KEY}|${transactionId}|${pay}|${product.title}|${user.name}|${user.email}|||||||||||${process.env.MERCHANT_SALT}`;

                    res.status(200).json({
                        product: { ...product, pay },
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
