const libExpress = require("express");
const { getUserByToken } = require("../db/users");
const { getProductForTransaction } = require("../db/products");
const { createTransaction, updateTransactionHash, getAllTransactionData } = require("../db/transactions");
const { getBenifitByCouponCodeIdAndProductId, getCouponCodeIdByCouponCode } = require("../db/coupon");
const { generateSHA512 } = require("../utils");

const router = libExpress.Router();

//temp
router.get("/all", async (req, res) => {
    try {
        const transactions = await getAllTransactionData(req.query);
        return res.status(200).json(transactions);
    } catch (error) {
        console.error("Transaction error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

//create new transactions1
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
                transaction.price = Number(product.price);
                transaction.discounted = ((Number(product.discounted) * 100) / (100 + Number(process.env.CGST) + Number(process.env.SGST))).toFixed(2); //118  - 100 18
                transaction.couponId = req.body.couponCode && (await getCouponCodeIdByCouponCode(req.body.couponCode));
                transaction.benifit = 0;
                transaction.productAccessValidity = product.access_validity;
                //validate coupon and check if coupon can  be used
                if (transaction.couponId && (couponCodeBenifit = await getBenifitByCouponCodeIdAndProductId(transaction.couponId, product.id))) {
                    transaction.benifit =
                        couponCodeBenifit.type == "PERCENTAGE" ? (transaction.discounted * couponCodeBenifit.value) / 100 : couponCodeBenifit.value;
                    transaction.discounted -= transaction.benifit;
                    if (couponCodeBenifit.product_access_validity) {
                        transaction.productAccessValidity = couponCodeBenifit.product_access_validity;
                    }
                }

                transaction.sgst = ((transaction.discounted * Number(process.env.SGST)) / 100).toFixed(2); //7.2
                transaction.cgst = ((transaction.discounted * Number(process.env.CGST)) / 100).toFixed(2); //7.2
                transaction.pay = parseFloat(transaction.discounted + transaction.sgst + transaction.cgst).toFixed(2);

                transaction.userId = user.id;
                transaction.payuMerchantKey = process.env.MERCHANT_KEY;
                transaction.successURL = process.env.TRANSACTION_SUCCESS_URL;
                transaction.failureURL = process.env.TRANSACTION_FAILURE_URL;
                transaction.payuURL = process.env.PAYU_URL;

                transaction.id = await createTransaction(transaction);
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
