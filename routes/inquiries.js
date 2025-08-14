const libExpress = require("express");
const { requestService } = require("../utils");
const { getTransactionByInvoice } = require("../db/transactions");
const logger = require("../libs/logger");
const { getUserByTransactionId } = require("../db/users");
const { getProductById } = require("../db/products");
const { deleteInquiryById } = require("../db/inquiries");

const router = libExpress.Router();

router.delete("/:inquiryId", async (req, res) => {
    if (!req.params.inquiryId) {
        return res.status(400).json({ error: "Failed To Delete Inquiry" });
    }
    deleteInquiryById(req.params.inquiryId);
    res.sendStatus(204);
});

module.exports = router;
