const libExpress = require("express");
const logger = require("../libs/logger");
const { getAllUsers } = require("../db/users");

const router = libExpress.Router();

router.get("/", async (req, res) => {
    const { search, appliedFilters } = req.query;
    logger.info(`Searching Users - search : ${search} | filters : ${appliedFilters}`);
    //get ALl Users
    const users = await getAllUsers();

    //Filter the Users if includes the email phone or name like give

    res.status(200).json(users);
});

module.exports = router;
