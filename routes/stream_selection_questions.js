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
    deleteStreamSelectionQuestionById,
    deleteStreamSelectionQuestionOptionsById,
    deleteStreamSelectionQuestionOptionsByQuestionId,
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
router.delete("/:id", requires_authority(AUTHORITIES.DELETE_AUTHORITIES), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing authorityId" });
    }
    //delete authority
    deleteAuthorityById({ id: req.params.id });
    //this authority needs to go away from roleauthorities
    deleteRoleAuthoritiesByAuthorityId({ authority_id: req.params.id });
    res.sendStatus(204);
});

//tested
router.post("/:id", requires_authority(AUTHORITIES.DELETE_STREAM_SELECTION_TEST), async (req, res) => {
    if (!req.params?.id) {
        return res.status(400).json({ error: "Missing Question Id" });
    }

    deleteStreamSelectionQuestionById(req.params);
    deleteStreamSelectionQuestionOptionsByQuestionId({ question_id: req.params.id });

    res.sendStatus(204);
});

module.exports = router;
