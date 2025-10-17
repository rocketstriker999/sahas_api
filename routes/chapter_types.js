const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { updateChapterTypeViewIndexById } = require("../db/chapter_types");

const router = libExpress.Router();

//tested
router.patch("/view_indexes", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(updateChapterTypeViewIndexById);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Chapter Types" });
});

module.exports = router;
