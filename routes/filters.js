const libExpress = require("express");
const logger = require("../libs/logger");
const { getRoles } = require("../db/roles");

const router = libExpress.Router();

//get all filters

router.get("/", async (req, res) => {
    const booleanFilters = [
        { title: "Yes", id: "TRUE" },
        { title: "No", id: "FALSE" },
    ];

    res.status(200).json({
        roles: await getRoles(),
        branches: [
            { title: "B1", id: 1 },
            { title: "B2", id: 2 },
        ],
        courses: [],
        active: booleanFilters,
        dues: booleanFilters,
    });
});

module.exports = router;
