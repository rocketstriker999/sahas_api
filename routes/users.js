const libExpress = require("express");
const logger = require("../libs/logger");
const {
    getAllUsersBySearchAndFilters,
    getCountUsersBySearchAndFilters,
    getUserById,
    updateUserBasics,
    getUserRolesByUserId,
    updateUserById,
} = require("../db/users");
const { getInquiriesByUserId } = require("../db/inquiries");
const { validateRequestBody } = require("../utils");
const { getEnrollmentsByUserId, addEnrollment } = require("../db/enrollments");
const { getEnrollmentCoursesByEnrollmentId, addEnrollmentCourse } = require("../db/enrollment_courses");
const { getTransactionsByEnrollmentId } = require("../db/enrollment_transactions");
const { addUserRoleByUserIdAndRoleId, getUserRoleByUserRoleId } = require("../db/user_roles");
const {
    getWalletTransactionsByUserId,
    getWalletBalanceByUserId,
    addWalletTransaction,
    getWalletTransactionByWalletTransactionId,
} = require("../db/wallet_transactions");

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

//tested
router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    return res.status(200).json(await getUserById({ ...req.params }));
});

//tested
router.put("/", async (req, res) => {
    const requiredBodyFields = ["id", "full_name", "phone", "image", "address", "branch_id", "active"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateUserById({ ...validatedRequestBody });
        res.status(200).json(await getUserById({ ...validatedRequestBody }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.get("/:id/inquiries", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    res.status(200).json(await getInquiriesByUserId({ user_id: req.params.id }));
});

router.get("/:id/enrollments", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const enrollments = await getEnrollmentsByUserId({ user_id: req.params.id });

    // const enrollmentsWithCourses = await Promise.all(
    //     enrollments.map(async (enrollment) => ({
    //         ...enrollment,
    //         courses: await getEnrollmentCoursesByEnrollmentId(enrollment.id),
    //     }))
    // );

    // const enrollmentsWithCoursesAndTranscations = await Promise.all(
    //     enrollmentsWithCourses.map(async (enrollment) => ({
    //         ...enrollment,
    //         transactions: await getTransactionsByEnrollmentId(enrollment.id),
    //     }))
    // );

    return res.status(200).json(enrollments);
});

router.post("/:userId/enrollments", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const requiredBodyFields = ["course", "end_date", "start_date", "fees"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        //add enrollment
        const enrollmentId = await addEnrollment({ user_id: req.params.userId, created_by: req.user.id, ...validatedRequestBody });
        //add course from it
        if (enrollmentId) await addEnrollmentCourse({ created_by: req.user.id, enrollment_id: enrollmentId, course_id: validatedRequestBody?.course?.id });
        else return res.status(400).json({ error: "Invalid Data for Enrollments" });

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
        return res.status(201).json(enrollmentsWithCoursesAndTranscations);
    } else {
        return res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.get("/:userId/roles", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    res.status(200).json(await getUserRolesByUserId(req.params.userId));
});

router.post("/:userId/roles", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const requiredBodyFields = ["role_id"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const userRoleId = await addUserRoleByUserIdAndRoleId({ user_id: req.params.userId, created_by: req.user.id, ...validatedRequestBody });

        res.status(201).json(await getUserRoleByUserRoleId(userRoleId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

router.get("/:userId/wallet-transactions", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const transactions = {
        balance: await getWalletBalanceByUserId(req.params.userId),
        transactions: await getWalletTransactionsByUserId(req.params.userId),
    };

    res.status(200).json(transactions);
});

router.post("/:userId/wallet-transactions", async (req, res) => {
    if (!req.params.userId) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const requiredBodyFields = ["amount", "note"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        const walletTransactionId = await addWalletTransaction({ user_id: req.params.userId, created_by: req.user.id, ...validatedRequestBody });
        res.status(201).json(await getWalletTransactionByWalletTransactionId(walletTransactionId));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
