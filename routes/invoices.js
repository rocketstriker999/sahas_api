const libExpress = require("express");
const { requestService } = require("../utils");
const { getTransactionByInvoice } = require("../db/transactions");
const logger = require("../libs/logger");
const { getUserByTransactionId } = require("../db/users");
const { getProductById } = require("../db/products");

const router = libExpress.Router();

//update user's details before purchase if user is missing primary details -1
router.get("/regenerate/:invoice", async (req, res) => {
    if ((transaction = await getTransactionByInvoice(req.params.invoice))) {
        logger.info(`Regenerating Invoice ${transaction.invoice}`);

        requestService({
            requestServiceName: process.env.SERVICE_MEDIA,
            requestPath: "generate/invoice",
            requestMethod: "POST",
            requestPostBody: {
                transaction,
                user: await getUserByTransactionId(transaction.id),
                product: await getProductById(transaction.product_id),
                percent_sgst: process.env.SGST,
                percent_cgst: process.env.CGST,
            },
            onResponseReceieved: ({ invoice }, responseCode) => {
                if (responseCode === 201) return res.status(201).json({ message: "Regenerating" });
                return res.redirect(`/not-found`);
            },
            onRequestFailure: (error) => {
                logger.error(`Failed To regenerate Invoice for transcation - ${transaction.id} error - ${error}`);
                return res.redirect(`/not-found`);
            },
        });
    } else {
        return res.status(400).json({ error: "Missing or Invalid Invoice" });
    }
});

module.exports = router;
