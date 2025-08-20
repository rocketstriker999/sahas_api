const libExpress = require("express");
const logger = require("../libs/logger");
const { getRoles } = require("../db/roles");
const { getAllBranches } = require("../db/branches");

const router = libExpress.Router();

const booleanFilters = [
    { title: "Yes", id: "TRUE" },
    { title: "No", id: "FALSE" },
];
router.get("/users", async (req, res) => {
    res.status(200).json({
        active: booleanFilters,
        dues: booleanFilters,
    });
});

router.get("/reports", async (req, res) => {
    //we will technically return the filters needed for this screen
});

router.get("/any-other-screen", async (req, res) => {
    //we will technically return the filters needed for this screen
});

module.exports = router;
