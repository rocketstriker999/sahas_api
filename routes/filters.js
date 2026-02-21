const libExpress = require("express");

const router = libExpress.Router();

const booleanFilters = [
    { title: "Yes", id: "TRUE" },
    { title: "No", id: "FALSE" },
];

const sortFilters = [
    { title: "Latest First", id: "DESC" },
    { title: "Oldest First", id: "ASC" },
];

router.get("/users", async (req, res) => {
    res.status(200).json({
        active: booleanFilters,
        dues: booleanFilters,
        id: sortFilters,
    });
});

router.get("/reports", async (req, res) => {
    //we will technically return the filters needed for this screen
});

router.get("/any-other-screen", async (req, res) => {
    //we will technically return the filters needed for this screen
});

module.exports = router;
