const libExpress = require("express");
const { deleteInquiryNoteById } = require("../db/inquiry_notes");
const { validateRequestBody } = require("../utils");
const { addMedia, getMediaById, deleteMediaById, updateMediaViewIndexById } = require("../db/media");

const router = libExpress.Router();

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["chapter_id", "title", "cdn_url", "type"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const mediaId = await addMedia({ ...validatedRequestBody, created_by: req.user.id });
        res.status(201).json(await getMediaById({ id: mediaId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.patch("/view_indexes", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(updateMediaViewIndexById);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Media" });
});

//tested
router.delete("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing inquiryNoteId" });
    }
    deleteMediaById({ id: req.params.id });
    //remove associated media from bucket as well
    res.sendStatus(204);
});

module.exports = router;
