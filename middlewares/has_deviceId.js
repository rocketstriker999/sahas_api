const logger = require("../libs/logger");

export default async (req, res, next) => {
    if (req.headers["Device-ID"]) {
        next();
    }

    return res.status(400).json({ error: "Missing Device ID" });
};
