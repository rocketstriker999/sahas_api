const libExpress = require("express");
const logger = require("../libs/logger");
const {
    getAllUsersBySearchAndFilters,
    getCountUsersBySearchAndFilters,
    getUserById,
    updateUserBasics,
    getUserRolesByUserId,
    updateUserById,
} = require("../db/users");
const { getInquiriesByUserId } = require("../db/inquiries");
const { validateRequestBody } = require("../utils");
const { getEnrollmentsByUserId } = require("../db/enrollments");

const { addUserRoleByUserIdAndRoleId, getUserRoleByUserRoleId } = require("../db/user_roles");
const { getWalletTransactionsByUserId } = require("../db/wallet_transactions");

const router = libExpress.Router();

router.get("/", async (req, res) => {
    const { search, offSet, limit, ...appliedFilters } = req.query;
    logger.info(`Searching Users - search : ${search} | filters : ${JSON.stringify(appliedFilters)} | offSet : ${offSet} | limit : ${limit}`);

    //get All Users
    const users = {
        recordsCount: await getCountUsersBySearchAndFilters(search, appliedFilters),
        dataSet: await getAllUsersBySearchAndFilters(search, appliedFilters, offSet, limit),
    };

    res.status(200).json(users);
});

//tested
router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    return res.status(200).json(await getUserById({ ...req.params }));
});

//tested
router.put("/", async (req, res) => {
    const requiredBodyFields = ["id", "full_name", "phone", "image", "address", "branch_id", "active"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateUserById({ ...validatedRequestBody });
        res.status(200).json(await getUserById({ ...validatedRequestBody }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.get("/:id/inquiries", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    res.status(200).json(await getInquiriesByUserId({ user_id: req.params.id }));
});

//tested
router.get("/:id/enrollments", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const enrollments = await getEnrollmentsByUserId({ user_id: req.params.id });

    return res.status(200).json(enrollments);
});

//tested
router.get("/:userId/wallet-transactions", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    res.status(200).json(await getWalletTransactionsByUserId(req.params.userId));
});

//tested
router.get("/:userId/roles", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    res.status(200).json(await getUserRolesByUserId(req.params.userId));
});

router.post("/:userId/roles", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const requiredBodyFields = ["role_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const userRoleId = await addUserRoleByUserIdAndRoleId({ user_id: req.params.userId, created_by: req.user.id, ...validatedRequestBody });

        res.status(201).json(await getUserRoleByUserRoleId(userRoleId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
