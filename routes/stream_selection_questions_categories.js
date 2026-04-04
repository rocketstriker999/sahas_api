const libExpress = require("express");

const { validateRequestBody } = require("sahas_utils");
const requires_authority = require("../middlewares/requires_authority");
const { AUTHORITIES } = require("../constants");
const { getStreamSelectionQuestionsCountByCategoryId } = require("../db/stream_selection_questions");
const {
    getAllStreamSelectionQuestionCategories,
    addStreamSelectionQuestionCategory,
    getStreamSelectionQuestionCategoryById,
    deleteStreamSelectionQuestionCategoryById,
    updateStreamSelectionQuestionCategoryById,
} = require("../db/stream_selection_question_categories");

const router = libExpress.Router();

//tested
router.get("/", async (req, res) => {
    const streamSelectionQuestionCategories = await getAllStreamSelectionQuestionCategories();

    for (const category of streamSelectionQuestionCategories) {
        category.questions = await getStreamSelectionQuestionsCountByCategoryId({ category_id: category?.id });
    }

    return res.status(200).json(streamSelectionQuestionCategories);
});

//tested
router.post("/", requires_authority(AUTHORITIES.CREATE_STREAM_SELECTION_QUESTION_CATEGORY), async (req, res) => {
    const requiredBodyFields = ["title", "active"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const categoryId = await addStreamSelectionQuestionCategory(validatedRequestBody);

        const category = await getStreamSelectionQuestionCategoryById({ id: categoryId });
        category.questions = await getStreamSelectionQuestionsCountByCategoryId({ category_id: category?.id });

        res.status(201).json(category);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.delete("/:id", requires_authority(AUTHORITIES.DELETE_STREAM_SELECTION_QUESTION_CATEGORY), async (req, res) => {
    if (!req.params?.id) {
        return res.status(400).json({ error: "Missing Question Id" });
    }

    deleteStreamSelectionQuestionCategoryById(req.params);

    res.sendStatus(204);
});

//tested
router.put("/", requires_authority(AUTHORITIES.UPDATE_STREAM_SELECTION_QUESTION_CATEGORY), async (req, res) => {
    const requiredBodyFields = ["id", "title", "active"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateStreamSelectionQuestionCategoryById(validatedRequestBody);

        const category = await getStreamSelectionQuestionCategoryById({ id: requiredBodyFields?.id });
        category.questions = await getStreamSelectionQuestionsCountByCategoryId({ category_id: category?.id });

        res.status(200).json(category);
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
