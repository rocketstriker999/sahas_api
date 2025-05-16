const libExpress = require("express");
const { requestService } = require("../utils");
const { getTransactionByInvoice } = require("../db/transactions");

const router = libExpress.Router();

//update user's details before purchase if user is missing primary details -1
router.get("/regenrate/:invoice", async (req, res) => {
    if (req.params.invoice) {
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
                return res.status(responseCode).json(invoice);
            },
            onRequestFailure: (error) => {
                logger.error(`Failed To regenerate Invoice for transcation - ${transaction.id} error - ${error}`);
                return res.status(500).json({ error: "Failed To Generate Invoice" });
            },
        });
    } else {
        return res.status(400).json({ error: "Missing Invoice Id" });
    }
});

module.exports = router;
