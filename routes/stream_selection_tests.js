const libExpress = require("express");
const { addStreamSelectionTest, addStreamSelectionTestAnswer, updateStreamSelectionTestResultById } = require("../db/stream_selection_tests");
const openai = require("../libs/openai");
const { updateStreamSelectionTestByUserId } = require("../db/users");
const router = libExpress.Router();
const { setTimeout } = require("timers/promises");

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

        const aiInput = `You are a career guidance expert specializing in stream selection for students after 10th standard.

            Your task is to analyze a student's responses and recommend the most suitable stream.

            ### STUDENT RESPONSES:
            Below is a list of questions and answers collected from the student:

            ${req.body
                    .map(({ question, option }) => `Q: ${question}\nA: ${option}`)
                    .join("\n\n")
                }

            ### INSTRUCTIONS:
            1. Carefully interpret the student's personality, interests, and academic strengths from the responses.
            2. Identify signals related to:
            - Interests (sports, subjects, activities)
            - Academic strengths/weaknesses (especially Maths)
            - Practical vs theoretical preference
            - Career inclination (if hinted)
            - Family background (low importance unless clearly relevant)
            3. Do NOT assume missing information.
            4. If Maths ability is unclear, treat it as neutral.

            ### ALLOWED STREAMS:
            - Science
            - Commerce
            - Diploma
            - Engineering

            ### DECISION LOGIC:
            - Strong interest alignment → highest weight
            - Weak Maths → penalize Science & Engineering
            - Strong Maths → boost Science & Engineering
            - Practical inclination → favor Diploma
            - Business/finance inclination → favor Commerce

            ### OUTPUT RULES:
            - Return ONLY valid JSON (no explanation outside JSON)
            - Keep suggestion under 50 words
            - Keep each stream feedback under 20 words
            - Use simple, student-friendly language
            - Be realistic, not overly motivational

            ### OUTPUT FORMAT:
            {
            "suggestion": "<direct advice to student>",
            "analysis": [
                {
                "stream": "<stream name>",
                "score": "<percentage>",
                "feedback": "<short reason>"
                }
            ]
            }

            ### STRICT CONSTRAINTS:
            - Total score must equal 100%
            - Include ALL 4 streams
            - Order by score (highest first)
            - Do not skip any stream

            ### NOW ANALYZE THE RESPONSES AND RETURN JSON ONLY.`

        logger.input(`Applying Input to AI - ${aiInput}`)

        const response = await openai.responses.create({
            model: "gpt-4.1",
            input: aiInput,
        });

        await updateStreamSelectionTestResultById({ id: streamSelectionTestId, result: response.output[0].content[0].text });

        //update user that stream selection test is taken
        updateStreamSelectionTestByUserId({ stream_selection_test_taken: true, user_id: req.user.id });

        //Fake Delay
        await setTimeout(10000);

        return res.sendStatus(201);
    }

    return res.status(400).json({ error: "Missing Test Questions" });
});

module.exports = router;
