const libExpress = require("express");
const logger = require("../libs/logger");
const { getAllUsersBySearchAndFilters, getCountUsersBySearchAndFilters, getUserById, updateUserBasics, getUserRolesByUserId } = require("../db/users");
const { getInquiriesByUserId, addInquiry, getInquiryByInquiryId } = require("../db/inquiries");
const { validateRequestBody } = require("../utils");
const { getInquiryNotesByInquiryId, addInquiryNote } = require("../db/inquiry_notes");
const { getEnrollmentsByUserId, addEnrollment } = require("../db/enrollments");
const { getEnrollmentCoursesByEnrollmentId, addEnrollmentCourse } = require("../db/enrollment_courses");
const { getTransactionsByEnrollmentId } = require("../db/transactions");
const { deleteUserRoleByUserRoleId } = require("../db/user_roles");

const router = libExpress.Router();

router.delete("/:userRoleId", async (req, res) => {
    if (!req.params.userRoleId) {
        return res.status(400).json({ error: "Missing Role Id" });
    }

    deleteUserRoleByUserRoleId(req.params.userRoleId);
    res.sendStatus(204);
});

module.exports = router;
