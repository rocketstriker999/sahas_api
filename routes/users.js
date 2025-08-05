const libExpress = require("express");
const logger = require("../libs/logger");
const { getAllUsers, getAllUsersBySearchAndFilters } = require("../db/users");

const router = libExpress.Router();

router.get("/", async (req, res) => {
    const { search, appliedFilters, offset, limit } = req.query;
    logger.info(`Searching Users - search : ${search} | filters : ${appliedFilters}`);

    //get All Users
    let users = await getAllUsersBySearchAndFilters(search, appliedFilters, limit, offset);

    // if searched query is there
    //Filter the Users if includes the email phone or name like give

    //it is time to apply filters if we have any
    if (appliedFilters && Object.keys(appliedFilters)) {
        //role
        //branches
        //active
        //dues
    }

    res.status(200).json(users);
});

module.exports = router;
