const libExpress = require("express");
const { deleteInquiryNoteById } = require("../db/inquiry_notes");
const { validateRequestBody } = require("../utils");
const { addMedia, getMediaById, deleteMediaById, updateMediaViewIndexById, updateMediaById, getMediaByChapterIdTypeAndTitle } = require("../db/media");

const router = libExpress.Router();

//tested
router.post(
    "/",
    async (req, res, next) => {
        const requiredBodyFields = ["chapter_id", "title", "type", "view_index"];
        const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);
        if (!isRequestBodyValid) {
            return res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
        }
        req.body = validatedRequestBody;
        next();
    },
    async (req, res, next) => {
        if (!!(await getMediaByChapterIdTypeAndTitle(req.body))) {
            return res.status(400).json({ error: "Media Already Exist" });
        }
        next();
    },
    async (req, res) => {
        const mediaId = await addMedia({ ...req.body, created_by: req.user.id });
        res.status(201).json(await getMediaById({ id: mediaId }));
    }
);

//tested
router.patch("/view_indexes", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(updateMediaViewIndexById);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Media" });
});

//tested
router.patch("/", async (req, res) => {
    const requiredBodyFields = ["id", "title"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateMediaById(validatedRequestBody);
        res.status(200).json(await getMediaById({ id: validatedRequestBody.id }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
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

//tested
router.get(
    "/:id",
    (req, res, next) => {
        //check if user has access to this media id - joining chapter , subject and course -> with subscription -> add middleware
        next();
    },
    async (req, res) => {
        if (!req.params.id) {
            return res.status(400).json({ error: "Missing Media Id" });
        }

        res.status(200).json(await getMediaById({ id: req.params.id }));
    }
);

module.exports = router;
