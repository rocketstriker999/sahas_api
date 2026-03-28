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
router.post("/", async (req, res) => {
    return res.status(201).json({ msg: "done" });
});

module.exports = router;
