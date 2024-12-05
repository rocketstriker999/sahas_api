const libExpress = require("express");

const router = libExpress.Router();

router.get("/navbar", (req, res) => {
    res.status(200).json({
        hero: {
            image: "https://placehold.co/100x20/black/FFFFFF/png",
            text: "SAHAS",
        },
        product_categories: [
            { categoryName: "cat1", categoryIcon: "pi pi-fw pi-sign-in" },
            { categoryName: "cat2", categoryIcon: "pi pi-fw pi-sign-in" },
        ],
        notifications_visible: true,
    });
});

router.get("/footer", (req, res) => {
    res.status(200).json({
        title: "Level up your life with Sahas study app.",
        background_color: "bg-black-alpha-90",
        copyright_notice:
            "Copyright © 2024 Sahas Institute. All rights reserved.",

        organization: {
            name: "Sahas Smart Studies",
            email: "support@sahasinstitute.com",
            branches: [
                {
                    name: "Waghodia",
                    full_address:
                        "FF9 Sharnam /complex, Opp. HDFC Bank, Near Crystal School, Waghodia Dabhoi ring Road - Vadodara",
                    contact: "9265352165",
                },
                {
                    name: "Karelibaug",
                    full_address:
                        "E 110 Vrundavan Township, Beside Tasty Restaurant, Near Sangam Cross Road, Karelibaug - Vadodara",
                    contact: "9265347133",
                },
                {
                    name: "Sayajigunj",
                    full_address:
                        "3rd Floor (347,348,349), Iscon Janmahal, Opposite Vadodara Railway Station, Sayajigunj - Vadodara",
                    contact: "9265343871",
                },
            ],
        },

        links: [
            {
                name: "Social",
                urls: [
                    {
                        name: "Facebook",
                        url: "https://facebook.com",
                        icon: "pi-facebook",
                    },
                    {
                        name: "Instagram",
                        url: "https://instagram.com",
                        icon: "pi-instagram",
                    },
                    {
                        name: "YouTube",
                        url: "https://youtube.com",
                        icon: "pi-youtube",
                    },
                ],
            },
            {
                name: "Site Map",
                urls: [
                    {
                        name: "Home",
                        url: "https://example.com/home",
                        icon: "pi-home",
                    },
                    {
                        name: "About Us",
                        url: "https://example.com/about",
                        icon: "pi-info-circle",
                    },
                    {
                        name: "Contact",
                        url: "https://example.com/contact",
                        icon: "pi-envelope",
                    },
                ],
            },
            {
                name: "General",
                urls: [
                    {
                        name: "Service & Membership Terms",
                        url: "https://example.com/service-terms",
                        icon: "pi-file",
                    },
                    {
                        name: "Return/Refund Policy",
                        url: "https://example.com/refund-policy",
                        icon: "pi-money-bill",
                    },
                    {
                        name: "Terms & Conditions",
                        url: "https://example.com/terms",
                        icon: "pi-book",
                    },
                    {
                        name: "Privacy Policy",
                        url: "https://example.com/privacy-policy",
                        icon: "pi-lock",
                    },
                ],
            },
            {
                name: "Policies",
                urls: [
                    {
                        name: "Cookie Policy",
                        url: "https://example.com/cookie-policy",
                    },
                    {
                        name: "Accessibility Policy",
                        url: "https://example.com/accessibility",
                    },
                    {
                        name: "Acceptable Use Policy",
                        url: "https://example.com/acceptable-use",
                        icon: "pi-ban",
                    },
                ],
            },
            {
                name: "Legal",
                urls: [
                    {
                        name: "Copyright Information",
                        url: "https://example.com/copyright",
                        icon: "pi-copyright",
                    },
                    {
                        name: "Disclaimers",
                        url: "https://example.com/disclaimers",
                        icon: "pi-exclamation-triangle",
                    },
                    {
                        name: "Governing Law",
                        url: "https://example.com/governing-law",
                        icon: "pi-globe",
                    },
                ],
            },
        ],
    });
});

router.get("/login", (req, res) => {
    const data = {
        navbar_visible: true,
        footer_visible: true,
        banner_login: {
            visible: true,
            image: "https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg",
        },
        form_login: {
            ask_email: {
                visible: true,
                title: "Log in to continue your learning journey",
            },
            ask_otp: {
                visible: true,
                otp_length: 4,
                resend_otp_time: 10,
                title: "Verify The OTP We have Sent to You",
            },
        },
    };

    res.status(200).json(data);
});

router.get("/dashboard", (req, res) => {
    const data = {
        navbar_visible: true,
        footer_visible: true,
        showcase: {
            visible: true,
            title: "Sahas Smart Studies",
            tagline: "Learn Digitally",
            description: "Lorem ipsum placeholder text.",
            product_categories: [
                {
                    image: "https://placehold.co/100x100/black/FFFFFF/png",
                    name: "Cat1",
                },
                {
                    image: "https://placehold.co/100x100/pink/FFFFFF/png",
                    name: "Cat2",
                },
                {
                    image: "https://placehold.co/100x100/green/FFFFFF/png",
                    name: "Cat3",
                },
            ],
        },

        trends: {
            visible: true,
            title: "Top trends for the future of work",
            tagline:
                "GenAI and leadership are at the core of today's skills-based economy. Get the 2024 Global Learning & Skills Trends Report to learn more.",
            images: [
                "https://primefaces.org/cdn/primereact/images/galleria/galleria2.jpg",
                "https://primefaces.org/cdn/primereact/images/galleria/galleria1.jpg",
                "https://primefaces.org/cdn/primereact/images/galleria/galleria3.jpg",
                "https://primefaces.org/cdn/primereact/images/galleria/galleria4.jpg",
                "https://primefaces.org/cdn/primereact/images/galleria/galleria5.jpg",
            ],
        },
        testimonies: {
            visible: true,
            title: "See what others are achieving through learning",
            testimonies: [
                {
                    testimonyId: 1,
                    userName: "Raj Shah",
                    recordedDate: "22-04-2024",
                    testimony:
                        "This is sample testimony for product 1 and This is Second Line For Testing",
                    productName: "Product 1",
                },
                {
                    testimonyId: 2,
                    userName: "Maulik Panchal Maulik Panchal",
                    recordedDate: "22-04-2024",
                    testimony:
                        "This is sample testimony for Product 3. This is the second line for testing.This is sample testimony for Product 3. This is the second line for testing.This is sample testimony for Product 3. This is the second line for testing.",
                    productName: "Product 2",
                },
                {
                    testimonyId: 3,
                    userName: "Anjali Patel Maulik Panchal",
                    recordedDate: "22-04-2024",
                    testimony:
                        "Amazing product! Highly recommend it to everyone.",
                    productName: "Product 3",
                },
                {
                    testimonyId: 4,
                    userName: "Anjali Patel Ml",
                    recordedDate: "10-05-2024",
                    testimony:
                        "Amazing product! Highly recommend it to everyone.",
                    productName: "Product 4",
                },
            ],
        },
    };

    setTimeout(() => {
        res.status(200).json(data);
    }, 3000);
});

router.get("/product", (req, res) => {
    res.status(200).json({
        navbar_visible: true,
        footer_visible: true,
        product_primary: {
            background_color: "bg-bluegray-900",
            visible: true,
        },
        product_secondary: {
            visible: true,
            title: "Product Content",
        },
    });
});

router.get("/products", (req, res) => {
    res.status(200).json({
        navbar_visible: true,
        footer_visible: true,

        products_search: {
            visible: true,
            product_categories: ["Cat1", "Cat2"],
        },

        products_list: {
            visible: true,
            title: "Found Products",
            multiple_list_style: true,
            items_per_page: 6,
        },
    });
});

router.get("/demo", (req, res) => {
    const data = {
        navbar_visible: true,
        footer_visible: true,
        content_sections: {
            visible: true,
            title: "Demo Content",
            sections: [
                { title: "Videos", icon: "pi-video", key: "videos" },
                { title: "Audios", icon: "pi-headphones", key: "audios" },
                { title: "Pdfs", icon: "pi-file-pdf", key: "pdfs" },
                { title: "Tests", icon: "pi-clock", key: "questions" },
            ],
        },
        purchase: { visible: true, title: "Buy Now" },
    };
    res.status(200).json(data);
});

module.exports = router;
