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
                transaction.userId = user.id;
                transaction.payuMerchantKey = process.env.MERCHANT_KEY;
                transaction.successURL = process.env.TRANSACTION_SUCCESS_URL;
                transaction.failureURL = process.env.TRANSACTION_FAILURE_URL;
                transaction.payuURL = process.env.PAYU_URL;
                transaction.productId = product.id;
                transaction.productTitle = product.title;
                transaction.price = Number(product.price);
                transaction.discounted = (Number(product.discounted) * 100) / (100 + Number(process.env.CGST) + Number(process.env.SGST));
                transaction.benifit = 0;
                transaction.sgst = (transaction.discounted * Number(process.env.SGST)) / 100;
                transaction.cgst = (transaction.discounted * Number(process.env.CGST)) / 100;
                transaction.pay = transaction.discounted;
                transaction.productAccessValidity = product.access_validity;

                //validate coupon and check if coupon can  be used
                transaction.couponId = req.body.couponCode && (await getCouponCodeIdByCouponCode(req.body.couponCode));
                if (transaction.couponId && (couponCodeBenifit = await getBenifitByCouponCodeIdAndProductId(transaction.couponId, product.id))) {
                    transaction.benifit =
                        couponCodeBenifit.type == "PERCENTAGE" ? (transaction.discounted * couponCodeBenifit.value) / 100 : couponCodeBenifit.value;
                    transaction.discounted -= transaction.benifit;
                    if (couponCodeBenifit.product_access_validity) {
                        transaction.productAccessValidity = couponCodeBenifit.product_access_validity;
                    }
                }

                //show in proper format
                transaction.price = Number(transaction.price).toFixed(2);
                transaction.discounted = Number(transaction.discounted).toFixed(2);
                transaction.benifit = Number(transaction.benifit).toFixed(2);
                transaction.discounted = Number(transaction.price).toFixed(2);
                transaction.sgst = Number(transaction.sgst).toFixed(2);
                transaction.cgst = Number(transaction.cgst).toFixed(2);
                transaction.pay = Number(transaction.pay).toFixed(2);

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
