const libExpress = require("express");
const { getAllCategories } = require("../db/categories");
const { getProductsByCategory, getProductsByCategoryAndUser, getProductsByToken, getProductById } = require("../db/products");
const { getUserByToken } = require("../db/users");
const { getAccessByProductIdAndToken } = require("../db/accesses");
const { getInvoiceByTransactionId } = require("../db/invoices");
const { getCoursesByProductId } = require("../db/courses");
const { getSubjectsCountByProductId, getSubjectsByCourseId } = require("../db/subjects");
const { getCourseByProductIdAndCourseId } = require("../db/courses");
const { getChaptersBySubjectId } = require("../db/chapters");

const router = libExpress.Router();

router.get("/catelogue", async (req, res) => {
    const categories = await getAllCategories();
    const catelogue = [];
    let user = false;

    if (req.cookies.token) {
        user = await getUserByToken(req.cookies.token);
    }

    for (const category of categories) {
        if (user.id) {
            catelogue.push({ ...category, products: await getProductsByCategoryAndUser(category.id, user.id) });
        } else {
            catelogue.push({ ...category, products: await getProductsByCategory(category.id) });
        }
    }

    res.status(200).json(catelogue);
});

router.get("/mine", async (req, res) => {
    if (req.cookies.token) {
        return res.status(200).json(await getProductsByToken(req.cookies.token));
    }
    res.status(401).json({});
});

router.get("/:id", async (req, res) => {
    if (req.params.id) {
        const product = await getProductById(req.params.id);
        if (req.cookies.token) {
            product.access = await getAccessByProductIdAndToken(product.id, req.cookies.token);
            if (product.access && product.access.transaction_id) {
                product.invoice = await getInvoiceByTransactionId(product.access.transaction_id);
            }
        }
        product.courses = await getCoursesByProductId(product.id);
        for (const course of product.courses) {
            //get the subjects
            course.subjects = await getSubjectsByCourseId(course.id);
            //get chapters
            for (const subject of course.subjects) {
                subject.chapters = await getChaptersBySubjectId(subject.id);
            }
        }
        return res.status(200).json({ ...product });
    }
    res.status(400).json({ error: "Missing Product ID" });
});

// router.get("/:productId/courses/:courseId", async (req, res) => {
//     if (req.params.productId && req.params.courseId) {
//         //check if course is inside the product
//         //if product's access is there or not
//         //get the subjects add demo false or true

//         if (course) {
//             course.has_access = req.cookies.token ? await getAccessByProductIdAndToken(req.params.productId, req.cookies.token) : false;
//             //get subjects
//             course.subjects = await getSubjectsByCourseId(course.id);
//             //get all the subjects and contents
//             for (const subject of course.subjects) {
//                 //get the chapters
//                 subject.chapters = await getChaptersBySubjectId(subject.id);
//             }

//             return res.status(200).json({ ...course });
//         } else {
//             return res.status(400).json({ error: "Product Is not having this course" });
//         }
//     }
//     res.status(400).json({ error: "Missing CourseId" });
// });

module.exports = router;
