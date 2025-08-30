const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { addWalletTransaction, getWalletTransactionById } = require("../db/wallet_transactions");

const router = libExpress.Router();

router.post("/", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const requiredBodyFields = ["user_id", "amount", "note"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const walletTransactionId = await addWalletTransaction({ created_by: req.user.id, ...validatedRequestBody });
        res.status(201).json(await getWalletTransactionById(walletTransactionId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
