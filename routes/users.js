const libExpress = require("express");
const logger = require("../libs/logger");
const { getAllUsersBySearchAndFilters, getCountUsersBySearchAndFilters, getUserById, updateUserBasics } = require("../db/users");
const { getInquiriesByUserId } = require("../db/inquiries");
const { validateRequestBody } = require("../utils");
const { getInquiryNotesByInquiryId } = require("../db/inquiry_notes");
const { getEnrollmentsByUserId } = require("../db/enrollments");
const { getEnrollmentCoursesByEnrollmentId } = require("../db/enrollment_courses");
const { getTransactionsByEnrollmentId } = require("../db/transactions");

const router = libExpress.Router();

router.get("/", async (req, res) => {
    const { search, offSet, limit, ...appliedFilters } = req.query;
    logger.info(`Searching Users - search : ${search} | filters : ${JSON.stringify(appliedFilters)} | offSet : ${offSet} | limit : ${limit}`);

    //get All Users
    const users = {
        recordsCount: await getCountUsersBySearchAndFilters(search, appliedFilters),
        dataSet: await getAllUsersBySearchAndFilters(search, appliedFilters, offSet, limit),
    };

    res.status(200).json(users);
});

router.get("/:userId", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const basics = await getUserById(req.params.userId);

    if (!basics) {
        return res.status(400).json({ error: "User Not Found" });
    }

    return res.status(200).json(basics);
});

router.put("/:userId", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const requiredBodyFields = ["full_name", "phone", "image", "address", "branch_id", "active"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateUserBasics({ ...validatedRequestBody, id: req.params.userId });
        res.status(200).json(await getUserById(req.params.userId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.get("/:userId/inquiries", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const inquiries = await getInquiriesByUserId(req.params.userId);

    const inquiriesWithNotes = await Promise.all(
        inquiries.map(async (inquiry) => ({
            ...inquiry,
            notes: await getInquiryNotesByInquiryId(inquiry.id),
        }))
    );

    res.status(200).json(inquiriesWithNotes);
});

router.get("/:userId/enrollments", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const enrollments = await getEnrollmentsByUserId(req.params.userId);

    const enrollmentsWithCourses = await Promise.all(
        enrollments.map(async (enrollment) => ({
            ...enrollment,
            courses: await getEnrollmentCoursesByEnrollmentId(enrollment.id),
        }))
    );

    const enrollmentsWithCoursesAndTranscations = await Promise.all(
        enrollmentsWithCourses.map(async (enrollment) => ({
            ...enrollment,
            transactions: await getTransactionsByEnrollmentId(enrollment.id),
        }))
    );

    return res.status(200).json(enrollmentsWithCoursesAndTranscations);
});

module.exports = router;
