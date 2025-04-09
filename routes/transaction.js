const libExpress = require("express");
const { getUserByToken } = require("../db/users");
const { getProductForTransaction } = require("../db/products");
const { createTransaction, updateTransactionHash, getAllTransactionData } = require("../db/transactions");
const { getBenifitByCouponCodeIdAndProductId, getCouponCodeIdByCouponCode } = require("../db/coupon");
const { generateSHA512 } = require("../utils");

const router = libExpress.Router();

//create new transactions

router.get("/all", async (req, res) => {
    try {
        const transactions = await getAllTransactionData();
        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Transaction error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

router.post("/", async (req, res) => {
    if (req.cookies.token) {
        const user = await getUserByToken(req.cookies.token);
        if (user) {
            if (req.body.productId) {
                //oroginal product
                const product = await getProductForTransaction(req.body.productId);
                console.log("product", product);
                const transaction = {};
                transaction.productId = product.id;
                transaction.productTitle = product.title;
                transaction.price = product.price;
                transaction.pay = product.discounted;
                transaction.couponId = req.body.couponCode && (await getCouponCodeIdByCouponCode(req.body.couponCode));
                transaction.benifit = 0;
                transaction.productAccessValidity = product.access_validity;
                //validate coupon and check if coupon can  be used
                if (transaction.couponId && (couponCodeBenifit = await getBenifitByCouponCodeIdAndProductId(transaction.couponId, product.id))) {
                    transaction.benifit = couponCodeBenifit.type == "PERCENTAGE" ? (transaction.pay * couponCodeBenifit.value) / 100 : couponCodeBenifit.value;
                    transaction.pay -= transaction.benifit;
                    if (couponCodeBenifit.product_access_validity) {
                        console.log("couponCodeBenifit", couponCodeBenifit.product_access_validity);
                        transaction.productAccessValidity = couponCodeBenifit.product_access_validity;
                    }
                }
                transaction.sgst = Number((transaction.pay * process.env.SGST) / 100);
                transaction.cgst = Number((transaction.pay * process.env.CGST) / 100);
                transaction.discounted = parseFloat(transaction.pay - transaction.sgst - transaction.cgst + transaction.benifit).toFixed(2);
                transaction.userId = user.id;
                transaction.payuMerchantKey = process.env.MERCHANT_KEY;
                transaction.successURL = process.env.TRANSACTION_SUCCESS_URL;
                transaction.failureURL = process.env.TRANSACTION_FAILURE_URL;
                transaction.payuURL = process.env.PAYU_URL;

                transaction.id = await createTransaction(transaction);
                console.log("transaction", transaction);
                transaction.hash = generateSHA512(
                    `${transaction.payuMerchantKey}|${transaction.id}|${transaction.pay}|${product.title}|${user.name}|${user.email}|||||||||||${process.env.MERCHANT_SALT}`
                );

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
        res.status(401).json({ error: "Missing Token" });
    }
});

module.exports = router;
