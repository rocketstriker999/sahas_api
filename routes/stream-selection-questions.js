const { logger } = require("sahas_utils");

const { validateRequestBody } = require("sahas_utils");
const requires_authority = require("../middlewares/requires_authority");
const { AUTHORITIES } = require("../constants");
const {
    addStreamSelectionTest,
    addStreamSelectionQuestion,
    addStreamSelectionQuestionOption,
    getStreamSelectionQuestionById,
    getStreamSelectionQuestionOptionByQuestionId,
} = require("../db/stream_selection_questions");

const router = libExpress.Router();

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
            streamSelectionQuestion.options = await getStreamSelectionQuestionOptionByQuestionId({ question_id: questionId });

            return res.status(201).json(streamSelectionQuestion);
        }
        res.status(400).json({ error: "Unable To Add Stream Selection Question" });
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});
