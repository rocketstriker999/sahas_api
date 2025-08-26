const libExpress = require("express");
const {
    deleteInquiryNoteByInquiryNoteId,
    addInquiryNote,

    getInquiryNoteById,
} = require("../db/inquiry_notes");
const { validateRequestBody } = require("../utils");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    const requiredBodyFields = ["inquiry_id", "note"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const inquityNoteId = await addInquiryNote({ ...validatedRequestBody, created_by: req.user.id });
        res.status(201).json(await getInquiryNoteById(inquityNoteId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.delete("/:inquiryNoteId", async (req, res) => {
    if (!req.params.inquiryNoteId) {
        return res.status(400).json({ error: "Missing inquiryNoteId" });
    }
    deleteInquiryNoteByInquiryNoteId(req.params.inquiryNoteId);
    res.sendStatus(204);
});

module.exports = router;
