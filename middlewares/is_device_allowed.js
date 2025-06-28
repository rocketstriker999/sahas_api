const { getDevicesByToken } = require("../db/devices");
const { getUserByToken } = require("../db/users");
const logger = require("../libs/logger");

//if user's mamping with device
//if user device's mapping with no user exist inseet allowed
//if already exist the mapping then verify the user's access

module.exports = async (req, res, next) => {
    // if (req.cookies.token && (user = await getUserByToken(req.cookies.token))) {
    //     //next();
    //     const devices = await getDevicesByToken(req.cookies.token);
    //     console.log(devices);
    //     return;
    // }

    // return res.status(401).json({ error: "Missing Device ID" });

    next();
};
