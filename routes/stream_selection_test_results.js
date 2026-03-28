const libExpress = require("express");
const { getLatestStreamSelectionTestByUserId } = require("../db/stream_selection_tests");
const { openai } = require("../libs/openai");

const router = libExpress.Router();

//tested
router.get("/", async (req, res) => {
    const result = await getLatestStreamSelectionTestByUserId({ user_id: req?.user?.id });

    res.status(200).json(result);
});

module.exports = router;
