const libExpress = require("express");
const { requestService } = require("../utils");
const { getTransactionByInvoice } = require("../db/transactions");
const logger = require("../libs/logger");
const { getUserByTransactionId } = require("../db/users");
const { getProductById } = require("../db/products");

const router = libExpress.Router();

router.delete("/:inquiryId", async (req, res) => {
    if (!req.params.inquiryId) {
        return res.status(400).json({ error: "Failed To Delete Inquiry" });
    }

    res.status(204).json({ error: "Deleted" });
});

module.exports = router;
