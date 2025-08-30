const libExpress = require("express");
const { validateRequestBody } = require("../utils");
const { addWalletTransaction, getWalletTransactionById } = require("../db/wallet_transactions");

const router = libExpress.Router();

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["user_id", "amount", "note"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const walletTransactionId = await addWalletTransaction({ created_by: req.user.id, ...validatedRequestBody });
        res.status(201).json(await getWalletTransactionById({ id: walletTransactionId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
