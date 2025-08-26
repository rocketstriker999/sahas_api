const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { deleteInquiryById, updateInquiryStatusById, addInquiry, getInquiryById, updateInquiryById } = require("../db/inquiries");
const { deleteInquiryNotesByInquiryId, getInquiryNotesByInquiryId, addInquiryNote, deleteInquiryNoteByInquiryNoteId } = require("../db/inquiry_notes");

const router = libExpress.Router();

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["user_id", "course_id", "note", "branch_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const inquiryId = await addInquiry({ ...validatedRequestBody, created_by: req.user.id });
        await addInquiryNote({ inquiry_id: inquiryId, note: validatedRequestBody.note, created_by: req.user.id });
        res.status(201).json(await getInquiryById({ id: inquiryId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "active", "branch_id", "course_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateInquiryById({ ...validatedRequestBody });
        res.status(200).json(await getInquiryById(validatedRequestBody));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing inquiry id" });
    }
    deleteInquiryById({ id: req.params.id });
    deleteInquiryNotesByInquiryId({ inquiry_id: req.params.id });
    res.sendStatus(204);
});

router.delete("/:inquiryId/notes/:noteId", async (req, res) => {
    if (!req.params.inquiryId || !req.params.noteId) {
        return res.status(400).json({ error: "Missing inquiryId or noteId" });
    }
    deleteInquiryNoteByInquiryNoteId(req.params.noteId);
    res.sendStatus(204);
});

//tested
router.get("/:id/notes", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing inquiryId" });
    }
    res.status(200).json(await getInquiryNotesByInquiryId({ inquiry_id: req.params.id }));
});

module.exports = router;
