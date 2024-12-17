const libExpress = require("express");
const { getContentById } = require("../db/content");
const router = libExpress.Router();

router.get("/:id", async (req, res) => {
    if (req.params.id) {
        //if content id is there
        //check if demo
        //check if chapter's data
        const content = await getContentById(req.params.id);

        return res.status(200).json(content);
    }
    return res.status(400).json({ error: "Missing Content Id" });
});

module.exports = router;
