const libExpress = require("express");

const router = libExpress.Router();

router.get("/create", async (req, res) => {
    res.status(200).json({
        device_id: `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
    });
});

module.exports = router;
