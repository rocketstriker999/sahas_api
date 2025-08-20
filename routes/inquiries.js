const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { deleteInquiryById, addInquiry, getInquiryByInquiryId } = require("../db/inquiries");
const { deleteInquiryNotesByInquiryId, getInquiryNotesByInquiryId, addInquiryNote, deleteInquiryNoteByInquiryNoteId } = require("../db/inquiry_notes");

const router = libExpress.Router();

router.delete("/:inquiryId", async (req, res) => {
    if (!req.params.inquiryId) {
        return res.status(400).json({ error: "Failed To Delete Inquiry" });
    }
    deleteInquiryById(req.params.inquiryId);
    deleteInquiryNotesByInquiryId(req.params.inquiryId);
    res.sendStatus(204);
});

router.delete("/:inquiryId/notes/:noteId", async (req, res) => {
    if (!req.params.inquiryId || !req.params.noteId) {
        return res.status(400).json({ error: "Missing inquiryId or noteId" });
    }
    deleteInquiryNoteByInquiryNoteId(req.params.noteId);
    res.sendStatus(204);
});

router.post("/:inquiryId/notes", async (req, res) => {
    if (!req.params.inquiryId) {
        return res.status(400).json({ error: "Missing inquiryId" });
    }
    const requiredBodyFields = ["note"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await addInquiryNote({ ...validatedRequestBody, created_by: req.user.id, inquiry_id: req.params.inquiryId });
        res.status(201).json(await getInquiryNotesByInquiryId(req.params.inquiryId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
