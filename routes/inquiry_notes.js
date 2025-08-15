const libExpress = require("express");
const { deleteInquiryNoteByNoteId, addInquiryNote, getInquiryNotesByInquiryId, getInquiryNoteByInquiryNoteId } = require("../db/inquiry_notes");
const { validateRequestBody } = require("../utils");

const router = libExpress.Router();

router.delete("/:noteId", async (req, res) => {
    if (!req.params.noteId) {
        return res.status(400).json({ error: "Failed To Delete Inquiry Note" });
    }
    deleteInquiryNoteByNoteId(req.params.noteId);
    res.sendStatus(204);
});

router.post("/", async (req, res) => {
    const requiredBodyFields = ["inquiry_id", "note"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const inquiryNoteId = await addInquiryNote({ ...validatedRequestBody, created_by: req.user.id });

        res.status(201).json(getInquiryNoteByInquiryNoteId(inquiryNoteId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
