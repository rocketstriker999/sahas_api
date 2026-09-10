const libExpress = require("express");
const { validateRequestBody } = require("sahas_utils");
const { AUTHORITIES } = require("../constants");
const requires_authority = require("../middlewares/requires_authority");
const {
    getAllBatches,
    getBatchById,
    addBatch,
    updateBatchById,
    deleteBatchById,
    getUsersByBatchId,
    getBatchUserById,
    getAssignableUsersForBatch,
    isUserAssignable,
    isUserInBatch,
    addUserToBatch,
    removeUserFromBatch,
} = require("../db/batches");

const router = libExpress.Router();

router.get("/", requires_authority(AUTHORITIES.USE_PAGE_MANAGE_BATCHES), async (req, res) => {
    res.status(200).json(await getAllBatches());
});

router.get("/:id/users", requires_authority(AUTHORITIES.USE_PAGE_MANAGE_BATCHES), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Batch Id" });
    }

    const batch = await getBatchById({ id: req.params.id });
    if (!batch) {
        return res.status(400).json({ error: "Batch Not Exist" });
    }

    return res.status(200).json(await getUsersByBatchId({ batch_id: req.params.id }));
});

router.get("/:id/assignable-users", requires_authority(AUTHORITIES.USE_PAGE_MANAGE_BATCHES), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Batch Id" });
    }

    const batch = await getBatchById({ id: req.params.id });
    if (!batch) {
        return res.status(400).json({ error: "Batch Not Exist" });
    }

    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    if (!search) {
        return res.status(200).json([]);
    }

    return res.status(200).json(await getAssignableUsersForBatch({ batch_id: req.params.id, search, limit: 10 }));
});

router.post("/:id/users", requires_authority(AUTHORITIES.UPDATE_BATCH), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Batch Id" });
    }

    const requiredBodyFields = ["user_id"];
    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (!isRequestBodyValid) {
        return res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }

    const batch = await getBatchById({ id: req.params.id });
    if (!batch) {
        return res.status(400).json({ error: "Batch Not Exist" });
    }

    const assignable = await isUserAssignable({ user_id: validatedRequestBody.user_id });
    if (!assignable) {
        return res.status(400).json({ error: "User Not Assignable To Batch" });
    }

    const alreadyInBatch = await isUserInBatch({ batch_id: req.params.id, user_id: validatedRequestBody.user_id });
    if (alreadyInBatch) {
        return res.status(400).json({ error: "User Already In Batch" });
    }

    const id = await addUserToBatch({
        batch_id: req.params.id,
        user_id: validatedRequestBody.user_id,
        created_by: req.user?.id,
    });

    const assigned = await getBatchUserById({ id });
    if (assigned) {
        return res.status(201).json(assigned);
    }

    return res.status(400).json({ error: "Failed To Assign User To Batch" });
});

router.delete("/:id/users/:userId", requires_authority(AUTHORITIES.UPDATE_BATCH), async (req, res) => {
    if (!req.params.id || !req.params.userId) {
        return res.status(400).json({ error: "Missing Batch Id Or User Id" });
    }

    const batch = await getBatchById({ id: req.params.id });
    if (!batch) {
        return res.status(400).json({ error: "Batch Not Exist" });
    }

    const existing = await isUserInBatch({ batch_id: req.params.id, user_id: req.params.userId });
    if (!existing) {
        return res.status(400).json({ error: "User Not In Batch" });
    }

    await removeUserFromBatch({ batch_id: req.params.id, user_id: req.params.userId });
    res.sendStatus(204);
});

router.get("/:id", requires_authority(AUTHORITIES.USE_PAGE_MANAGE_BATCHES), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Batch Id" });
    }

    const batch = await getBatchById({ id: req.params.id });
    if (!batch) {
        return res.status(400).json({ error: "Batch Not Exist" });
    }

    return res.status(200).json(batch);
});

router.post("/", requires_authority(AUTHORITIES.CREATE_BATCH), async (req, res) => {
    const requiredBodyFields = ["title"];
    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (!isRequestBodyValid) {
        return res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }

    const id = await addBatch({ ...validatedRequestBody, created_by: req.user?.id });
    const batch = await getBatchById({ id });

    if (batch) {
        return res.status(201).json(batch);
    }

    return res.status(400).json({ error: "Failed To Add Batch" });
});

router.patch("/", requires_authority(AUTHORITIES.UPDATE_BATCH), async (req, res) => {
    const requiredBodyFields = ["id", "title"];
    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (!isRequestBodyValid) {
        return res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }

    const existing = await getBatchById({ id: validatedRequestBody.id });
    if (!existing) {
        return res.status(400).json({ error: "Batch Not Exist" });
    }

    await updateBatchById(validatedRequestBody);
    return res.status(200).json(await getBatchById({ id: validatedRequestBody.id }));
});

router.delete("/:id", requires_authority(AUTHORITIES.DELETE_BATCH), async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing Batch Id" });
    }

    const existing = await getBatchById({ id: req.params.id });
    if (!existing) {
        return res.status(400).json({ error: "Batch Not Exist" });
    }

    await deleteBatchById({ id: req.params.id });
    res.sendStatus(204);
});

module.exports = router;
