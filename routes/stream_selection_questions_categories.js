const libExpress = require("express");

const { validateRequestBody } = require("sahas_utils");
const requires_authority = require("../middlewares/requires_authority");
const { AUTHORITIES } = require("../constants");
const {
    addStreamSelectionQuestion,
    addStreamSelectionQuestionOption,
    getStreamSelectionQuestionById,
    getStreamSelectionQuestionOptionsByQuestionId,
    deleteStreamSelectionQuestionById,
} = require("../db/stream_selection_questions");
const { getAllStreamSelectionQuestionCategories } = require("../db/stream_selection_question_categories");

const router = libExpress.Router();

//tested
router.get("/", async (req, res) => {
    const streamSelectionQuestionCategories = await getAllStreamSelectionQuestionCategories();
    return res.status(200).json(streamSelectionQuestionCategories);
});

//tested
router.post("/", requires_authority(AUTHORITIES.CREATE_STREAM_SELECTION_TEST_QUESTION), async (req, res) => {
    const requiredBodyFields = ["title", "active"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        res.status(201).json({ error: "Unable To Add Stream Selection Question" });
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.delete("/:id", requires_authority(AUTHORITIES.DELETE_STREAM_SELECTION_TEST_QUESTION), async (req, res) => {
    if (!req.params?.id) {
        return res.status(400).json({ error: "Missing Question Id" });
    }

    deleteStreamSelectionQuestionById(req.params);

    res.sendStatus(204);
});

router.put("/", requires_authority(AUTHORITIES.UPDATE_STREAM_SELECTION_TEST_QUESTION), async (req, res) => {});

module.exports = router;
