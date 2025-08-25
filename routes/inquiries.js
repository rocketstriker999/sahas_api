const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { deleteInquiryById, updateInquiryStatusById, addInquiry, getInquiryById, updateInquiryById } = require("../db/inquiries");
const { deleteInquiryNotesByInquiryId, getInquiryNotesByInquiryId, addInquiryNote, deleteInquiryNoteByInquiryNoteId } = require("../db/inquiry_notes");

const router = libExpress.Router();

//create  a new inquiry
router.post("/", async (req, res) => {
    const requiredBodyFields = ["user_id", "course_id", "note", "branch_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const inquiryId = await addInquiry({ ...validatedRequestBody, created_by: req.user.id });
        addInquiryNote({ inquiry_id: inquiryId, note: validatedRequestBody.note, created_by: req.user.id });
        res.status(201).json(await getInquiryById(inquiryId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.patch("/", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing inquiry id" });
    }

    const requiredBodyFields = ["id", "status", "branch_id", "course_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        updateInquiryById({ ...validatedRequestBody });
        res.sendStatus(200);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing inquiry id" });
    }
    deleteInquiryById(req.params.id);
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
