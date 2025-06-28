import { getDevicesByToken } from "../db/devices";
import { getUserByToken } from "../db/users";

const logger = require("../libs/logger");

//req token ->   and req device ->   then

//   if user is not gaving registered device -> Insert  and allowed

// if user is having device already -> Insert also but not allowed

export default async (req, res, next) => {
    if (req.cookies.token && req.headers["Device-ID"] && (user = await getUserByToken(req.cookies.token))) {
        //next();
        const devices = await getDevicesByToken(req.cookies.token);
        console.log(devices);
    }

    return res.status(400).json({ error: "Missing Device ID" });
};
