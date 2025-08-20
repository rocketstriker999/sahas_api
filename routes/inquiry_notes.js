const libExpress = require("express");
const { deleteInquiryNoteByInquiryNoteId } = require("../db/inquiry_notes");

const router = libExpress.Router();

router.delete("/:inquiryNoteId", async (req, res) => {
    if (!req.params.inquiryNoteId) {
        return res.status(400).json({ error: "Missing inquiryNoteId" });
    }
    deleteInquiryNoteByInquiryNoteId(req.params.inquiryNoteId);
    res.sendStatus(204);
});

module.exports = router;
