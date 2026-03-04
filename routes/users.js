const libExpress = require("express");
const { logger } = require("sahas_utils");
const {
    getAllUsersBySearchAndFilters,
    getCountUsersBySearchAndFilters,
    getUserById,
    updateUserById,
    addUser,
    patchUserFullNameById,
    patchUserPhoneById,
} = require("../db/users");
const { getInquiriesByUserId } = require("../db/inquiries");
const { validateRequestBody } = require("sahas_utils");
const { getEnrollmentsByUserId } = require("../db/enrollments");
const { getWalletTransactionsByUserId } = require("../db/wallet_transactions");
const { getUserRolesByUserId } = require("../db/user_roles");
const { getEnrollmentCoursesByUserId, getEnrollmentCoursesByEnrollmentId } = require("../db/enrollment_courses");
const { getDevicesByUserId } = require("../db/devices");
const { getCourseSubjectsByCourseId } = require("../db/course_subjects");
const { getTestAttainableChaptersBySubjectId } = require("../db/chapters");
const { requestService } = require("sahas_utils");
const { getAllBranches, getBranchById } = require("../db/branches");
const { getAllCourses } = require("../db/courses");

const router = libExpress.Router();

//tested
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
router.get("/download", async (req, res) => {
    const { search, ...appliedFilters } = req.query;
    logger.info(`Searching Users - search : ${search} | filters : ${JSON.stringify(appliedFilters)} `);

    const users = await getAllUsersBySearchAndFilters(search, appliedFilters);

    const branchSelector = {};
    const courseSelector = {};

    const branches = await getAllBranches();
    const courses = await getAllCourses();

    for (const branch of branches) branchSelector[branch?.id] = branch?.title;
    for (const course of courses) courseSelector[course?.id] = course?.title;

    for (const user of users) {
        if (!!user?.branch_id) {
            user.branch = branchSelector[user?.branch_id];
        }

        if (!!user?.inquiries?.length) {
            user.inquiries = user?.inquiries?.map((inquiry) => `${courseSelector[inquiry?.course_id]} at ${branchSelector[inquiry?.branch_id]}`)?.join(" | ");
        }
    }

    await requestService({
        requestServiceName: process.env.SERVICE_MEDIA,
        onRequestStart: () => logger.info("Generating Users"),
        requestPath: "templated/sheet",
        requestMethod: "POST",
        requestPostBody: {
            template: "users",
            injects: users,
        },
        onResponseReceieved: (generatedUsers, responseCode) => {
            if (generatedUsers?.cdn_url && responseCode === 201) logger.success(`Users Sheet Generated !`);
            else logger.error(`Failed To Generate Users - Media Responded With ${JSON.stringify(generatedUsers)} - ${responseCode}`);
            return res.status(responseCode).json(generatedUsers);
        },
    });
});

//tested
router.get("/:id", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    return res.status(200).json(await getUserById({ ...req.params }));
});

//tested
router.get("/:id/courses", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    return res.status(200).json(await getEnrollmentCoursesByUserId({ user_id: req.params.id }));
});

//tested
router.get("/:id/chapters-test-catalogue", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const courses = await getEnrollmentCoursesByUserId({ user_id: req.params.id });

    for (const course of courses) {
        course.subjects = await getCourseSubjectsByCourseId({ course_id: course?.id });

        for (const subject of course.subjects) {
            subject.chapters = await getTestAttainableChaptersBySubjectId(subject);
        }
    }

    return res.status(200).json(courses);
});

//tested
router.put("/", async (req, res) => {
    const requiredBodyFields = ["id", "email", "full_name", "phone", "address", "active"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        await updateUserById({ ...validatedRequestBody });
        res.status(200).json(await getUserById({ ...validatedRequestBody }));
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

//tested
router.patch(
    "/name",
    async (req, res, next) => {
        const requiredBodyFields = ["id", "full_name"];
        const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);
        if (!isRequestBodyValid) {
            return res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
        }
        req.body = validatedRequestBody;
        next();
    },
    async (req, res) => {
        await patchUserFullNameById({ ...req.body });
        res.status(200).json(await getUserById({ id: req.body.id }));
    },
);

//tested
router.patch(
    "/phone",
    async (req, res, next) => {
        const requiredBodyFields = ["id", "phone"];
        const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);
        if (!isRequestBodyValid) {
            return res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
        }
        req.body = validatedRequestBody;
        next();
    },
    async (req, res) => {
        await patchUserPhoneById({ ...req.body });
        res.status(200).json(await getUserById({ id: req.body.id }));
    },
);

//tested
router.get("/:id/inquiries", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    res.status(200).json(await getInquiriesByUserId({ user_id: req.params.id }));
});

//tested
router.get("/:id/enrollments", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    const enrollments = await getEnrollmentsByUserId({ user_id: req.params.id });

    for (const enrollment of enrollments) {
        const courses = await getEnrollmentCoursesByEnrollmentId({ enrollment_id: enrollment?.id });
        enrollment.courses = courses?.map(({ title }) => title);
    }

    return res.status(200).json(enrollments);
});

//tested
router.get("/:id/devices", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    return res.status(200).json(await getDevicesByUserId({ user_id: req.params.id }));
});

//tested
router.get("/:id/wallet-transactions", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    res.status(200).json(await getWalletTransactionsByUserId({ user_id: req.params.id }));
});

//tested
router.get("/:id/roles", async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ error: "Missing User Id" });
    }

    res.status(200).json(await getUserRolesByUserId({ user_id: req.params.id }));
});

//tested
router.post("/", async (req, res) => {
    const requiredBodyFields = ["full_name", "email", "phone", "branch_id", "address"];

    const { isRequestBodyValid, missingRequestBodyFields, validatedRequestBody } = validateRequestBody(req.body, requiredBodyFields);

    if (isRequestBodyValid) {
        if ((userId = await addUser({ ...validatedRequestBody }))) {
            return res.status(201).json(await getUserById({ id: userId }));
        }
        res.status(400).json({ error: "Unable To Add User - User Might Already Exist" });
    } else {
        res.status(400).json({ error: `Missing ${missingRequestBodyFields?.join(",")}` });
    }
});

module.exports = router;
