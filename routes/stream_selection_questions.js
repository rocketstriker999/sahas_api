const { logger } = require("sahas_utils");
const libExpress = require("express");

const { validateRequestBody } = require("sahas_utils");
const requires_authority = require("../middlewares/requires_authority");
const { AUTHORITIES } = require("../constants");
const {
    addStreamSelectionQuestion,
    addStreamSelectionQuestionOption,
    getStreamSelectionQuestionById,
    getStreamSelectionQuestionOptionsByQuestionId,
    getAllStreamSelectionQuestions,
} = require("../db/stream_selection_questions");

const router = libExpress.Router();

//tested
router.get("/", async (req, res) => {
    const streamSelectionQuestions = await getAllStreamSelectionQuestions();

    for (const streamSelectionQuestion of streamSelectionQuestions) {
        streamSelectionQuestion.options = await getStreamSelectionQuestionOptionsByQuestionId({ question_id: streamSelectionQuestion?.id });
    }

    return res.status(200).json(streamSelectionQuestions);
});

//tested
router.post("/", requires_authority(AUTHORITIES.CREATE_STREAM_SELECTION_TEST), async (req, res) => {
    const requiredBodyFields = ["question", "options"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        if (validatedRequestBody?.options?.length > 0 && (questionId = await addStreamSelectionQuestion({ ...validatedRequestBody }))) {
            for (const option of validatedRequestBody?.options) {
                await addStreamSelectionQuestionOption({ question_id: questionId, option });
            }
            const streamSelectionQuestion = await getStreamSelectionQuestionById({ id: questionId });
            streamSelectionQuestion.options = await getStreamSelectionQuestionOptionsByQuestionId({ question_id: questionId });

            return res.status(201).json(streamSelectionQuestion);
        }
        res.status(400).json({ error: "Unable To Add Stream Selection Question" });
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
