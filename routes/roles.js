const libExpress = require("express");
const logger = require("../libs/logger");
const { route } = require("./data_dump");
const { getRoles } = require("../db/roles");

const router = libExpress.Router();

//get all roles
router.get("/", async (req, res) => {
    res.status(200).json(await getRoles());
});

module.exports = router;
