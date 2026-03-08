const libExpress = require("express");
const { validateRequestBody } = require("sahas_utils");
const { deleteInquiryById, updateInquiryStatusById, addInquiry, getInquiryById, updateInquiryById } = require("../db/inquiries");
const { deleteInquiryNotesByInquiryId, getInquiryNotesByInquiryId, addInquiryNote, deleteInquiryNoteByInquiryNoteId } = require("../db/inquiry_notes");
const requires_authority = require("../middlewares/requires_authority");
const { AUTHORITIES } = require("../constants");

const router = libExpress.Router();

//tested
router.post("/", requires_authority(AUTHORITIES.CREATE_INQUIRY), async (req, res) => {
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
router.patch("/", requires_authority(AUTHORITIES.UPDATE_INQUIRY), async (req, res) => {
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
router.delete("/:id", requires_authority(AUTHORITIES.DELETE_INQUIRY), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing inquiry id" });
    }
    deleteInquiryById({ id: req.params.id });
    deleteInquiryNotesByInquiryId({ inquiry_id: req.params.id });
    res.sendStatus(204);
});

//tested
router.get("/:id/notes", requires_authority(AUTHORITIES.READ_INQUIRY_NOTE), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing inquiryId" });
    }
    res.status(200).json(await getInquiryNotesByInquiryId({ inquiry_id: req.params.id }));
});

module.exports = router;
