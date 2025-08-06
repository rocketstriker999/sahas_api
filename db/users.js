const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");
const { param } = require("../routes/configs");

function updateUserToken(email, token) {
    return executeSQLQueryParameterized(`UPDATE USERS SET token=? WHERE email=?`, [token, email]).catch((error) => {
        logger.error(`updateUserToken: ${error}`);
        return false;
    });
}

function updateUserPrimaryDetails(id, name, phone) {
    return executeSQLQueryParameterized(`UPDATE USERS SET name=?, phone=? WHERE id=?`, [name, phone, id]).catch((error) => {
        logger.error(`updateUserPrimaryDetails: ${error}`);
        return false;
    });
}

function updateUserProfilePrimaryDetails(id, formData) {
    const { name, phone, address } = formData;
    return executeSQLQueryParameterized(`UPDATE USERS SET name=?, phone=?, address=? WHERE id=?`, [name, phone, address, id]).catch((error) => {
        logger.error(`updateUserPrimaryDetails: ${error}`);
        return false;
    });
}

function getUserByEmail(email) {
    return executeSQLQueryParameterized(`SELECT * FROM USERS WHERE email=?`, [email])
        .then((user) => (user && user.length > 0 ? user[0] : false))
        .catch((error) => {
            logger.error(`getUserByEmail: ${error}`);
            return false;
        });
}

function addDefaultRoleToUser(userId) {
    return executeSQLQueryParameterized(`INSERT INTO USER_ROLES(user_id,role_id) VALUES(?,1)`, [userId]).catch((error) => {
        logger.error(`addDefaultRoleToUser: ${error}`);
        return false;
    });
}

function addUserByEmail(email) {
    return executeSQLQueryParameterized(`INSERT IGNORE INTO USERS(email) VALUES(?)`, [email])
        .then((result) => result?.affectedRows && addDefaultRoleToUser(result?.insertId))
        .catch((error) => {
            logger.error(`addUserByEmail: ${error}`);
            return false;
        });
}

//affectedRows":1,"insertId":1

function getUserByAuthenticationToken(token) {
    return (
        token &&
        executeSQLQueryParameterized(
            `SELECT USERS.* FROM USER_AUTHENTICATION_TOKENS INNER JOIN USERS ON USER_AUTHENTICATION_TOKENS.user_id=USERS.id  WHERE USER_AUTHENTICATION_TOKENS.token=?`,
            [token]
        )
            .then((user) => (user && user.length > 0 ? user[0] : false))
            .catch((error) => {
                logger.error(`getUserByAuthenticationToken: ${error}`);
                return false;
            })
    );
}

function getGroupsById(id) {
    return executeSQLQueryParameterized("SELECT DISTINCT(title) FROM USER_GROUPS WHERE user_id=?", [id])
        .then((groups) => (groups && groups.length > 0 ? groups.map((row) => row.title) : []))
        .catch((error) => {
            logger.error(`getGroupsById: ${error}`);
            return false;
        });
}

function getAuthoritiesById(id) {
    return executeSQLQueryParameterized(`SELECT DISTINCT(title) FROM USER_AUTHORITIES WHERE user_id=?`, [id])
        .then((authorities) => (authorities && authorities.length > 0 ? authorities.map((row) => row.title) : []))
        .catch((error) => {
            logger.error(`getAuthoritiesById: ${error}`);
            return false;
        });
}

function validateUserOTP(email, otp) {
    return executeSQLQueryParameterized(`SELECT COUNT(*) AS count FROM USERS WHERE email = ? AND otp = ?`, [email, otp])
        .then(([result]) => {
            if (result.count > 0) {
                return true; // OTP is valid
            }
            return false; // OTP is invalid
        })
        .catch((error) => {
            logger.error(`validateUserOTP: ${error}`);
            return false;
        });
}

function creditUserWallet(userId, credit) {
    executeSQLQueryParameterized(`UPDATE USERS SET wallet = wallet + ? WHERE id = ?`, [credit, userId]).catch((error) =>
        logger.error(`creditCuponReward: ${error}`)
    );
}

// Temporary need to be removed Find user_id by email
function getUserIdByEmail(email) {
    return executeSQLQueryParameterized(`SELECT id FROM USERS WHERE email = ?`, [email])
        .then((results) => {
            return results.length > 0 ? results[0].id : null;
        })
        .catch((error) => {
            logger.error(`getUserIdByEmail: ${error}`);
            return null;
        });
}

//get user by transaction id
function getUserByTransactionId(transactionId) {
    return executeSQLQueryParameterized(`SELECT * FROM USERS INNER JOIN USER_TRANSACTIONS ON USERS.id=USER_TRANSACTIONS.user_id WHERE USER_TRANSACTIONS.id=?`, [
        transactionId,
    ])
        .then((results) => {
            return results.length > 0 ? results[0] : null;
        })
        .catch((error) => {
            logger.error(`getUserByTransactionId: ${error}`);
            return null;
        });
}

function getUserById(id) {
    return executeSQLQueryParameterized(`SELECT * FROM USERS WHERE id = ?`, [id])
        .then((results) => {
            return results.length > 0 ? results[0] : null;
        })
        .catch((error) => {
            logger.error(`getUserById: ${error}`);
            return null;
        });
}

function getUserRolesByUserId(userId) {
    return executeSQLQueryParameterized(
        `SELECT ROLES.id, ROLES.title FROM USER_ROLES LEFT JOIN ROLES ON USER_ROLES.role_id=ROLES.id WHERE ROLES.active=TRUE AND USER_ROLES.active=TRUE AND USER_ROLES.user_id = ?`,
        [userId]
    ).catch((error) => {
        logger.error(`getUserRolesByUserId: ${error}`);
        return null;
    });
}

function getUserAuthoritiesByRoles(userRoles) {
    return executeSQLQueryParameterized(
        `SELECT AUTHORITIES.title FROM ROLE_AUTHORITIES LEFT JOIN AUTHORITIES ON ROLE_AUTHORITIES.authority_id=AUTHORITIES.id WHERE AUTHORITIES.active=TRUE AND ROLE_AUTHORITIES.active=TRUE AND ROLE_AUTHORITIES.role_id in (?)`,
        [userRoles]
    ).catch((error) => {
        logger.error(`getUserAuthoritiesByRoles: ${error}`);
        return null;
    });
}

function getAllUsersBySearchAndFilters(search, appliedFilters, offSet, limit) {
    const query = [`SELECT DISTINCT USERS.* FROM USERS LEFT JOIN USER_ROLES ON USERS.id=USER_ROLES.user_id`];
    const parameters = [];

    if (!!search) {
        logger.info("SEARCH");
        query.push("WHERE");
        query.push(["full_name", "email", "phone"].map((key) => `${key} LIKE '%${search}%'`).join(" OR "));
    }

    if (!!appliedFilters) {
        //if priviously search is applied then we need to add AND
        if (search) query.push("AND");
        logger.info(JSON.stringify(appliedFilters));
        const { roles } = appliedFilters;

        if (roles) {
            query.push(`  USER_ROLES.id in (${roles})`);
        }
    }

    query.push("ORDER BY id");

    if (offSet && limit) {
        query.push(`LIMIT ?`);
        parameters.push(limit);
        query.push(`OFFSET ?`);
        parameters.push(offSet);
    }

    return executeSQLQueryParameterized(query.join(" "), parameters).catch((error) => {
        logger.error(`getAllUsersBySearchAndFilters: ${error}`);
        return [];
    });
}

function getCountUsersBySearchAndFilters(search, appliedFilters) {
    const query = [`SELECT COUNT(DISTINCT USERS.id) AS count FROM USERS LEFT JOIN USER_ROLES ON USERS.id=USER_ROLES.user_id`];
    const parameters = [];

    if (!!search) {
        logger.info("SEARCH");
        query.push("WHERE");
        query.push(["full_name", "email", "phone"].map((key) => `${key} LIKE '%${search}%'`).join(" OR "));
    }

    if (!!appliedFilters) {
        //if priviously search is applied then we need to add AND
        if (search) query.push("AND");
        logger.info(JSON.stringify(appliedFilters));

        const { roles } = appliedFilters;

        if (roles) {
            query.push(`  USER_ROLES.id in (${roles})`);
        }
    }

    return executeSQLQueryParameterized(query.join(" "), parameters)
        .then(([result]) => result.count)
        .catch((error) => {
            logger.error(`getCountUsersBySearchAndFilters: ${error}`);
            return 0;
        });
}

module.exports = {
    getAllUsersBySearchAndFilters,
    getCountUsersBySearchAndFilters,
    validateUserOTP,
    updateUserToken,
    getUserByEmail,
    getUserByAuthenticationToken,
    getGroupsById,
    getAuthoritiesById,
    updateUserPrimaryDetails,
    creditUserWallet,
    getUserIdByEmail,
    getUserByTransactionId,
    updateUserProfilePrimaryDetails,
    addUserByEmail,
    getUserById,
    getUserRolesByUserId,
    getUserAuthoritiesByRoles,
};
