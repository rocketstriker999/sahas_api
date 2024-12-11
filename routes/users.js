const libExpress = require("express");

const router = libExpress.Router();

router.get("/:id/products", (req, res) => {
    const userId = req.params.id;
    res.status(200).json([
        {
            id: 1,
            title: "ChatGPT Complete Guide: Learn actionable",
            image: "https://placehold.co/100x100/blue/FFFFFF/png",
            description: "25+ Generative AI Tools to 10x Business, Productivity, Creativity | Prompt Engineering, ChatGPT, Custom GPTs, Midjourney",
        },
        {
            id: 2,
            title: "ChatGPT Complete Guide: Learn actionable",
            image: "https://placehold.co/100x100/yellow/FFFFFF/png",
            description: "25+ Generative AI Tools to 10x Business, Productivity, Creativity | Prompt Engineering, ChatGPT, Custom GPTs, Midjourney",
        },
    ]);
});

module.exports = router;
