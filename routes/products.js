const libExpress = require("express");

const router = libExpress.Router();

router.get("/list", (req, res) => {
    const products = [
        {
            id: 1,
            title: "ChatGPT Complete Guide: Learn actionable",
            image: "https://placehold.co/100x100/blue/FFFFFF/png",
            description: "25+ Generative AI Tools to 10x Business, Productivity, Creativity | Prompt Engineering, ChatGPT, Custom GPTs, Midjourney",
            image: "https://placehold.co/320x180/green/FFFFFF/png",
            price: {
                discounted: 2000,
                original: 2200,
                discount: 20,
            },
        },
        {
            product_id: 1,
            title: "ChatGPT Complete Guide: Learn Generative AI, ChatGPT & More",
            description: "25+ Generative AI Tools to 10x Business, Productivity, Creativity | Prompt Engineering, ChatGPT, Custom GPTs, Midjourney",
            language: "English",
            hero: {
                image: "https://placehold.co/320x180/green/FFFFFF/png",
                video: "https://placehold.co/320x180/green/FFFFFF/png",
            },
            category: "cat-1",
        },
        {
            product_id: 2,
            title: "ChatGPT Complete Guide: Learn Generative AI, ChatGPT & More",
            description: "25+ Generative AI Tools to 10x Business, Productivity, Creativity | Prompt Engineering, ChatGPT, Custom GPTs, Midjourney",
            language: "English",
            hero: {
                image: "https://placehold.co/320x180/green/FFFFFF/png",
                video: "https://placehold.co/320x180/green/FFFFFF/png",
            },
            category: "cat-1",
            price: {
                discounted: 2000,
                original: 2200,
                discount: 20,
            },
        },
    ];

    res.status(200).json({ products });
});

router.get("/:id/primary-details", (req, res) => {
    res.status(200).json({
        product_id: 1,
        title: "ChatGPT Complete Guide: Learn Generative AI, ChatGPT & More",
        description: "25+ Generative AI Tools to 10x Business, Productivity, Creativity | Prompt Engineering, ChatGPT, Custom GPTs, Midjourney",
        language: "English",
        hero: {
            image: "https://placehold.co/320x180/green/FFFFFF/png",
            video: "https://placehold.co/320x180/green/FFFFFF/png",
        },
        category: "cat-1",
        key_points: [
            "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
            "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
            "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
            "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.",
        ],
    });
});

router.get("/:id/secondary-details", (req, res) => {
    res.status(200).json({
        has_access: false,
        courses: [
            {
                name: "course_1",
                subjects: [
                    {
                        name: "Subject 1",
                        chapters: [
                            {
                                name: "chap-1",
                                tagline: "this is a sample line",
                            },
                            {
                                name: "chap-2",
                                tagline: "this is a sample line",
                            },
                            {
                                name: "chap-3",
                                tagline: "this is a sample line",
                            },
                            {
                                name: "chap-4",
                                tagline: "this is a sample line",
                            },
                        ],
                    },
                    {
                        name: "Subject 2",
                        chapters: [
                            {
                                name: "chap-1",
                                tagline: "this is a sample line",
                            },
                            {
                                name: "chap-2",
                                tagline: "this is a sample line",
                            },
                            {
                                name: "chap-3",
                                tagline: "this is a sample line",
                            },
                            {
                                name: "chap-4",
                                tagline: "this is a sample line",
                            },
                        ],
                    },
                ],
            },
            {
                name: "course_2",
                subjects: [
                    {
                        name: "Econmoics",
                        chapters: [
                            {
                                name: "chapter 1",
                                tagline: "any single line for chapter 1",
                            },
                            {
                                name: "chap-2",
                                tagline: "this is a sample line",
                            },
                            {
                                name: "chap-3",
                                tagline: "this is a sample line",
                            },
                            {
                                name: "chap-4",
                                tagline: "this is a sample line",
                            },
                        ],
                    },
                    {
                        name: "Subject 2",
                        chapters: [
                            {
                                name: "chap-1",
                                tagline: "this is a sample line",
                            },
                            {
                                name: "chap-2",
                                tagline: "this is a sample line",
                            },
                            {
                                name: "chap-3",
                                tagline: "this is a sample line",
                            },
                            {
                                name: "chap-4",
                                tagline: "this is a sample line",
                            },
                        ],
                    },
                ],
            },
        ],
    });
});

router.get("/:id/demo", (req, res) => {
    res.status(200).json({
        title: "Title For Your Porudct Name",
        videos: [
            { id: 1, title: "title1", url: "dwaadw", duration: "01:00" },
            { id: 2, title: "title2", url: "dawdsefsrgf" },
        ],

        audios: [],
        pdfs: [],
    });
});

module.exports = router;
