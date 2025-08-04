const libExpress = require("express");
const logger = require("../libs/logger");
const { getAllUsers } = require("../db/users");

const router = libExpress.Router();

router.get("/", async (req, res) => {
    const { search, appliedFilters } = req.query;
    logger.info(`Searching Users - search : ${search} | filters : ${appliedFilters}`);

    //get All Users
    let users = await getAllUsers();

    // if searched query is there
    //Filter the Users if includes the email phone or name like give
    if (search) users = users.filter((user) => user?.full_name?.includes(search) || user?.email?.includes(search) || user?.phone?.includes(search));

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
