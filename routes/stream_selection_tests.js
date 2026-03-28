const libExpress = require("express");
const { addStreamSelectionTest, addStreamSelectionTestAnswer } = require("../db/stream_selection_tests");

const router = libExpress.Router();

//tested
router.post("/", async (req, res) => {
    if (req.body?.length) {
        const streamSelectionTestId = await addStreamSelectionTest({ user_id: req.user.id });

        for (const streamSelectionTestAnswer of req?.body) {
            await addStreamSelectionTestAnswer({
                stream_selection_test_id: streamSelectionTestId,
                question: streamSelectionTestAnswer?.question,
                answer: streamSelectionTestAnswer?.answer?.option,
            });
        }

        return res.status(201).json({ msg: "done" });
    }

    return res.status(400).json({ error: "Missing Test Questions" });
});

module.exports = router;
