const libExpress = require("express");
const libCrypto = require("crypto");

const router = libExpress.Router();

router.get("/list", (req, res) => {
    const products = [
        {
            product_id: 1,
            title: "ChatGPT Complete Guide: Learn Generative AI, ChatGPT & More",
            description:
                "25+ Generative AI Tools to 10x Business, Productivity, Creativity | Prompt Engineering, ChatGPT, Custom GPTs, Midjourney",
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
        {
            product_id: 2,
            title: "ChatGPT Complete Guide: Learn Generative AI, ChatGPT & More",
            description:
                "25+ Generative AI Tools to 10x Business, Productivity, Creativity | Prompt Engineering, ChatGPT, Custom GPTs, Midjourney",
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
        description:
            "25+ Generative AI Tools to 10x Business, Productivity, Creativity | Prompt Engineering, ChatGPT, Custom GPTs, Midjourney",
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

router.post("/:id/price", (req, res) => {
    const input = `${process.env.MERCHANT_KEY}|t6svtqtjRdl4ws1|10|iPhone|Ashish|test@gmail.com|||||||||||${process.env.MERCHANT_SALT}`;

    res.status(200).json({
        product_name: "iPhone",
        discounted: 10,
        original: 2200,
        discount: 20,
        payment_gateway: {
            success_url: "https://apiplayground-response.herokuapp.com/",
            failure_url: "https://apiplayground-response.herokuapp.com/",
            hash: libCrypto.createHash("sha512").update(input).digest("hex"),
            gateway_url: "https://test.payu.in/_payment",
            merchant_key: process.env.MERCHANT_KEY,
            transaction_id: "t6svtqtjRdl4ws1",
        },

        user: {
            phone: "9988776655",
            email: "test@gmail.com",
            firstname: "Ashish",
            lastname: "Kumar",
        },
    });
});

module.exports = router;
