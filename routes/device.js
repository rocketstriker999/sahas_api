const libExpress = require("express");

const router = libExpress.Router();

router.get("/create", async (req, res) => {
    setTimeout(() => {
        res.status(201).json({
            device_id: `${Date.now()}_${Math.random()
                .toString(36)
                .substring(2, 15)}`,
        });
    }, 3000);
});

module.exports = router;
