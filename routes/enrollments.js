const libExpress = require("express");
const { getAccessesByToken } = require("../db/accesses");
const cacher = require("../libs/cacher");
const { KEY_AUTHENTICATION_TOKEN } = require("../constants");
const router = libExpress.Router();

//get catelogue for user
router.get("/", async (req, res) => {
    //prepare and return catelogue
    res.status(200).json({
        data: "wad",
    });
});

module.exports = router;
