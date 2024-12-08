const { executeSQLQueryParameterized } = require("../libs/db");

function createUser(userEmail, otp) {}

function userLogin(userEmail, otp) {
    //if user exist
    executeSQLQueryParameterized(
        `
    INSERT INTO USERS (email, otp)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE otp = VALUES(otp)
`,
        [userEmail, otp]
    );
}

function updateUser() {}

module.exports = { userLogin };
