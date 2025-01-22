const libExpress = require("express");
const { getContentById } = require("../db/content");
const { getAccessByTokenAndContentId } = require("../db/accesses");

const router = libExpress.Router();

//a subject id and associated content id should be there
router.get("/subjects/:id", async (req, res) => {
    if (req.params.subjectId) {
        const content = await getContentById(req.params.subjectId);
        return res.status(200).json(content);
    }
    return res.status(400).json({ error: "Missing Content subjectId" });
});

// a chpater id and associated contentid should be there
router.get("/chapters/:id", async (req, res) => {
    if (req.cookies.token && req.params.id) {
        if (await getAccessByTokenAndContentId(req.cookies.token, req.params.id)) {
            const content = await getContentById(req.params.id);
            return res.status(200).json(content);
        }
        return res.status(401).json({ error: "You Don't Have access to this content" });
    }
    return res.status(400).json({ error: "Missing Required Details" });
});

module.exports = router;

// /content/demos/1

// /content/chapters/1
