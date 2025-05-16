const libExpress = require("express");
const { requestService } = require("../utils");
const { getTransactionByInvoice } = require("../db/transactions");
const logger = require("../libs/logger");
const { getUserByTransactionId } = require("../db/users");
const { getProductById } = require("../db/products");

const router = libExpress.Router();

//update user's details before purchase if user is missing primary details -1
router.get("/regenrate/:invoice", async (req, res) => {
    logger.info(`Regenerating Invoice ${req.params.invoice}`);
    const transaction = await getTransactionByInvoice(req.params.invoice);

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
        onResponseReceieved: (invoice, responseCode) => {
            logger.success(`Invoice Regenerated ${invoice}`);
        },
        onRequestFailure: (error) => {
            logger.error(`Failed To regenerate Invoice for transcation - ${transaction.id} error - ${error}`);
        },
    });
    return res.redirect(`/resources/invoices/${req.params.invoice}`);
});

module.exports = router;
