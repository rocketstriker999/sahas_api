const libExpress = require("express");
const logger = require("../libs/logger");
const { getAllUsers, getAllUsersBySearchAndFilters, getCountUsersBySearchAndFilters } = require("../db/users");

const router = libExpress.Router();

router.get("/", async (req, res) => {
    const { search, appliedFilters, offSet, limit } = req.query;
    logger.info(`Searching Users - search : ${search} | filters : ${appliedFilters} | offSet : ${offSet} | limit : ${limit}`);

    //get All Users
    const users = {
        dataSet: await getAllUsersBySearchAndFilters(search, appliedFilters, offSet, limit),
        recordsCount: await getCountUsersBySearchAndFilters(search, appliedFilters),
    };

    res.status(200).json(users);
});

module.exports = router;
