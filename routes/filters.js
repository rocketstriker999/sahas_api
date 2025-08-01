const libExpress = require("express");
const logger = require("../libs/logger");
const { getRoles } = require("../db/roles");

const router = libExpress.Router();

//get all filters

router.get("/", async (req, res) => {
    res.status(200).json({
        roles: await getRoles(),
        branches: [{ title: "B1" }, { title: "B2" }],
        courses: [],
        active: [true, false],
    });
});

module.exports = router;
