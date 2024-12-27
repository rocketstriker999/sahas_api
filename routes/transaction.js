const libExpress = require("express");
const libCrypto = require("crypto");
const { getUserByToken } = require("../db/users");
const { getProductForTransaction } = require("../db/products");
const { createTransaction, updateTransactionHash } = require("../db/transactions");
const libOS = require("os");
const networkInterfaces = os.networkInterfaces();

const router = libExpress.Router();

//create new transactions
router.post("/", async (req, res) => {
    if (req.cookies.token) {
        const user = await getUserByToken(req.cookies.token);
        if (user) {
            if (req.body.productId) {
                //oroginal product
                const product = await getProductForTransaction(req.body.productId);
                const transaction = {};
                transaction.productId = product.id;
                transaction.productTitle = product.title;
                transaction.price = product.price;
                transaction.pay = product.discounted;
                if (req.body.couponCode && req.body.couponCode === "TEST20") {
                    transaction.pay = transaction.pay - 20;
                    transaction.couponCode = req.body.couponCode;
                    transaction.benifit = 20;
                } else {
                    transaction.couponCode = null;
                    transaction.benifit = 0;
                }

                transaction.sgst = Number((transaction.pay * 18) / 100);
                transaction.cgst = Number((transaction.pay * 18) / 100);
                transaction.discounted = parseFloat(transaction.pay - transaction.sgst - transaction.cgst + transaction.benifit).toFixed(2);
                transaction.userId = user.id;
                transaction.payuMerchantKey = process.env.MERCHANT_KEY;
                transaction.successURL = process.env.TRANSACTION_SUCCESS_URL;
                transaction.failureURL = process.env.TRANSACTION_FAILURE_URL;
                transaction.payuURL = process.env.PAYU_URL;

                transaction.id = await createTransaction(transaction);

                transaction.hash = libCrypto
                    .createHash("sha512")
                    .update(
                        `${transaction.payuMerchantKey}|${transaction.id}|${transaction.pay}|${product.title}|${user.name}|${user.email}|||||||||||${process.env.MERCHANT_SALT}`
                    )
                    .digest("hex");

                await updateTransactionHash(transaction.id, transaction.hash);

                if (transaction.id) {
                    res.status(200).json({
                        ...transaction,
                        user: { name: user.name, phone: user.phone, email: user.email },
                    });
                } else {
                    res.status(400).json({ error: "Couldn't Create Transaction For This Product, Please Try again later" });
                }
            } else {
                res.status(400).json({ error: "Missing Prodict Details" });
            }
        } else {
            res.status(401).json({ error: "Invalid Token" });
        }
    } else {
        res.status(401).json({ error: "Invalid Token" });
    }
});

module.exports = router;
