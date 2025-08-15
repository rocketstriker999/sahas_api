const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { deleteInquiryById, addInquiry } = require("../db/inquiries");
const { deleteInquiryNotesByInquiryId, getInquiryNotesByInquiryId, addInquiryNote } = require("../db/inquiry_notes");

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
    const requiredBodyFields = ["user_id", "branch_id", "course_id", "note"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const inquiryId = await addInquiry({ ...validatedRequestBody, created_by: req.user.id });
        await addInquiryNote({ inquiry_id: inquiryId, note: validatedRequestBody.note, created_by: req.user.id });

        const inquiry = await getInquiryByInquiryId(inquiryId);
        inquiry.notes = await getInquiryNotesByInquiryId(inquiryId);

        res.status(201).json(inquiry);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
