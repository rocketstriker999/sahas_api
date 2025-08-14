const libExpress = require("express");
const { requestService } = require("../utils");
const { getTransactionByInvoice } = require("../db/transactions");
const logger = require("../libs/logger");
const { getUserByTransactionId } = require("../db/users");
const { getProductById } = require("../db/products");
const { deleteInquiryById } = require("../db/inquiries");
const { deleteInquiryNoteByNoteId } = require("../db/inquiry_notes");

const router = libExpress.Router();

router.delete("/:noteId", async (req, res) => {
    if (!req.params.noteId) {
        return res.status(400).json({ error: "Failed To Delete Inquiry Note" });
    }
    deleteInquiryNoteByNoteId(req.params.noteId);
    res.sendStatus(204);
});

module.exports = router;
