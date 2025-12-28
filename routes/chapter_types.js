const libExpress = require("express");
const { updateChapterTypeViewIndexById, deleteChapterTypeById, addChapterType, getChapterTypeById, updateChapterTypeById } = require("../db/chapter_types");
const { validateRequestBody } = require("sahas_utils");

const router = libExpress.Router();

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["title"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const chapterTypeId = await addChapterType(validatedRequestBody);
        res.status(201).json(await getChapterTypeById({ id: chapterTypeId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.patch("/view_indexes", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(updateChapterTypeViewIndexById);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Chapter Types" });
});

//tested
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "title"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateChapterTypeById(validatedRequestBody);
        res.status(200).json(await getChapterTypeById({ id: validatedRequestBody.id }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.delete("/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Chapter Type Id" });
    }
    //delete chapter Type
    deleteChapterTypeById({ id: req.params.id });
    res.sendStatus(204);
});

module.exports = router;
