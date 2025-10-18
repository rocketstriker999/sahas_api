const libExpress = require("express");
const { updateChapterTypeViewIndexById, deleteChapterTypeById } = require("../db/chapter_types");

const router = libExpress.Router();

//tested
router.patch("/view_indexes", async (req, res) => {
    if (req.body?.length) {
        req.body.forEach(updateChapterTypeViewIndexById);
        return res.sendStatus(200);
    }

    return res.status(400).json({ error: "Missing Chapter Types" });
});

//tested
router.delete("/:id", (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Chapter Type Id" });
    }
    //delete chapter Type
    deleteChapterTypeById({ id: req.params.id });
    res.sendStatus(204);
});

module.exports = router;
