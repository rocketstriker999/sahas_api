const libExpress = require("express");
const logger = require("../libs/logger");
const { getRoles } = require("../db/roles");

const router = libExpress.Router();

//get all filters

router.get("/", async (req, res) => {
    res.status(200).json({
        roles: await getRoles(),
        branches: [
            { title: "B1", id: 1 },
            { title: "B2", id: 2 },
        ],
        courses: [],
        active: [
            { title: "Yes", id: TRUE },
            { title: "No", id: FALSE },
        ],
        dues: [
            { title: "Yes", id: TRUE },
            { title: "No", id: FALSE },
        ],
    });
});

module.exports = router;
