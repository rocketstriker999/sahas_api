const libExpress = require("express");
const { addStreamSelectionTest, addStreamSelectionTestAnswer, updateStreamSelectionTestResultById } = require("../db/stream_selection_tests");
const openai = require("../libs/openai");
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

        const response = await openai.responses.create({
            model: "gpt-4.1",
            input: "Hello from router",
        });

        await updateStreamSelectionTestResultById({ id: streamSelectionTestId, result: response.output[0].content[0].text });

        // res.json(response.output[0].content[0].text);

        return res.sendStatus(201);
    }

    return res.status(400).json({ error: "Missing Test Questions" });
});

module.exports = router;
