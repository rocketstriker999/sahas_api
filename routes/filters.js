const libExpress = require("express");

const router = libExpress.Router();

const booleanFilters = [
    { title: "Yes", id: "TRUE" },
    { title: "No", id: "FALSE" },
];

const comparisionFilters = [
    { title: "Yes", id: "<" },
    { title: "No", id: ">" },
];

const sortFilters = [
    { title: "Latest First", id: "DESC" },
    { title: "Oldest First", id: "ASC" },
];

//filters for users management
router.get("/users", async (req, res) => {
    res.status(200).json([
        { title: "Status Active", key: "active", options: booleanFilters, type: "MULTI_SELECT" },
        { title: "Fees Due", key: "dues", options: booleanFilters, type: "MULTI_SELECT" },
        { title: "Sort Order", key: "id", options: sortFilters, type: "DROP_DOWN" },
    ]);
});

//filters for inquiry management
router.get("/inquiries", async (req, res) => {
    res.status(200).json({
        active: booleanFilters,
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
