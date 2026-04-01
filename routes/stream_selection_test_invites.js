const libExpress = require("express");
const {
    getAllStreamSelectionTestInvites,
    getStreamSelectionTestInviteById,
    updateStreamSelectionTestInviteById,
    addStreamSelectionTestInvite,
} = require("../db/stream_selection_test_invites");
const { updateStreamSelectionTestByUserId } = require("../db/users");
const { validateRequestBody } = require("sahas_utils");

const router = libExpress.Router();

// Get all stream selection test invites
router.get("/", async (req, res) => {
    const invites = await getAllStreamSelectionTestInvites();
    res.status(200).json(invites);
});

router.post("/", async (req, res) => {
    const requiredBodyFields = ["title"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const streamSelectionTestInviteId = await addStreamSelectionTestInvite(validateRequestBody);
        res.status(201).json(await getStreamSelectionTestInviteById({ id: streamSelectionTestInviteId }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }

    res.status(201).json(invites);
});

// Attend stream selection test
router.get("/:id/attend", async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "Missing Invite Id" });
    }

    const invite = await getStreamSelectionTestInviteById({ id });

    if (invite && invite.active) {
        await updateStreamSelectionTestByUserId({ user_id: req.user.id, stream_selection_test_taken: false });
        res.status(200).json({ message: "Attendance marked successfully" });
    } else {
        res.status(404).json({ error: "Invite not found or inactive" });
    }
});

// Update stream selection test invite
router.put("/", async (req, res) => {
    const requiredBodyFields = ["id", "title", "active"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateStreamSelectionTestInviteById(validatedRequestBody);
        res.status(200).json(await getStreamSelectionTestInviteById({ id: validatedRequestBody.id }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
