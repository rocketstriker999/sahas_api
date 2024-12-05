const libExpress = require("express");

const router = libExpress.Router();

router.get("/notifications", (req, res) => {
    setTimeout(() => {
        res.json([
            {
                title: "System Update",
                description: "A system update is scheduled for 12:00 AM tonight.",
                acknowledge: false,
            },
            {
                title: "Maintenance Alert",
                description: "Routine maintenance will occur on the server this Friday.",
                acknowledge: false,
            },
            {
                title: "Password Expiry",
                description: "Your password will expire in 5 days. Please update it.",
                acknowledge: true,
            },
            {
                title: "New Feature Release",
                description: "We’ve launched a new feature! Check it out in your dashboard.",
                acknowledge: false,
            },
            {
                title: "Survey Invitation",
                description: "Take our survey to help improve your experience.",
                acknowledge: false,
            },
            {
                title: "Weekly Report",
                description: "Your weekly activity report is now available.",
                acknowledge: true,
            },
            {
                title: "Holiday Notification",
                description: "The office will remain closed on the 25th of December.",
                acknowledge: false,
            },
            {
                title: "Security Notice",
                description: "Please enable two-factor authentication for your account.",
                acknowledge: false,
            },
            {
                title: "System Downtime",
                description: "Scheduled downtime will occur tomorrow from 2 AM to 4 AM.",
                acknowledge: true,
            },
            {
                title: "Promotional Offer",
                description: "Enjoy 20% off on your next subscription renewal!",
                acknowledge: false,
            },
        ]).status(200);
    }, 3000);
});

module.exports = router;
