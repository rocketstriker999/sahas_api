const libExpress = require("express");
const { addInquiryNote, getInquiryNoteById, deleteInquiryNoteById } = require("../db/inquiry_notes");
const { validateRequestBody } = require("../utils");

const router = libExpress.Router();

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["inquiry_id", "note"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const inquityNoteId = await addInquiryNote({ ...validatedRequestBody, created_by: req.user.id });
        res.status(201).json(await getInquiryNoteById({ id: inquityNoteId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing inquiryNoteId" });
    }
    deleteInquiryNoteById({ id: req.params.id });
    res.sendStatus(204);
});

module.exports = router;
