const libExpress = require("express");
const { requestService } = require("../utils");
const { getTransactionByInvoice } = require("../db/transactions");
const logger = require("../libs/logger");
const { getUserByTransactionId } = require("../db/users");
const { getProductById } = require("../db/products");
const { deleteInquiryById, addInquiry } = require("../db/inquiries");
const { deleteInquiryNotesByInquiryId, getInquiryNotesByInquiryId } = require("../db/inquiry_notes");

const router = libExpress.Router();

router.delete("/:inquiryId", async (req, res) => {
    if (!req.params.inquiryId) {
        return res.status(400).json({ error: "Failed To Delete Inquiry" });
    }
    deleteInquiryById(req.params.inquiryId);
    deleteInquiryNotesByInquiryId(req.params.inquiryId);
    res.sendStatus(204);
});

router.post("/", async (req, res) => {
    const requiredBodyFields = ["user_id", "created_by", "branch", "course_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const inquiryId = await addInquiry({ ...validatedRequestBody, created_by: req.user.id });
        await addInquiryNotes({ inquiryId, note, created_by: req.user.id });

        const inquiry = await getInquiryByInquiryId(inquiryId);
        inquiry.notes = await getInquiryNotesByInquiryId(inquiryId);

        res.status(201).json(inquiry);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
