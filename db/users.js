const { executeSQLQueryParameterized } = require("../libs/db");
const logger = require("../libs/logger");

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
        executeSQLQueryParameterized(`SELECT USERS.* FROM USER_TOKENS INNER JOIN USERS ON USER_TOKENS.user_id=USERS.id  WHERE USER_TOKENS.token=?`, [token])
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

function getUserRolesAuthoritiesByUserId(userId) {
    return executeSQLQueryParameterized(
        `SELECT USERS.id as user_id,USERS.full_name,USERS.email,USERS.phone,USERS.address,USERS.wallet,USERS.active as user_active,USERS.created_on,USERS.updated_at,
            COALESCE(
                JSON_ARRAYAGG(
                    CASE 
                        WHEN ROLES.id IS NOT NULL THEN
                            JSON_OBJECT(
                                'role_id', ROLES.id,
                                'role_title', ROLES.title,
                                'role_active', ROLES.active,
                                'user_role_active', USER_ROLES.active,
                                'role_created_on', ROLES.created_on,
                                'role_updated_at', ROLES.updated_at,
                                'authorities', COALESCE(role_authorities.authorities, JSON_ARRAY())
                            )
                        ELSE NULL
                    END
                ), 
                JSON_ARRAY()
            ) as roles_with_authorities
            FROM USERS
            LEFT JOIN USER_ROLES ON USERS.id = USER_ROLES.user_id AND USER_ROLES.active = TRUE
            LEFT JOIN ROLES ON USER_ROLES.role_id = ROLES.id AND ROLES.active = TRUE
            LEFT JOIN (
                SELECT 
                    ROLE_AUTHORITIES.role_id,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'authority_id', AUTHORITIES.id,
                            'authority_title', AUTHORITIES.title,
                            'authority_active', AUTHORITIES.active,
                            'role_authority_active', ROLE_AUTHORITIES.active,
                            'validity', ROLE_AUTHORITIES.validity,
                            'role_authority_title', ROLE_AUTHORITIES.title,
                            'is_expired', CASE WHEN ROLE_AUTHORITIES.validity < NOW() THEN true ELSE false END,
                            'days_until_expiry', DATEDIFF(ROLE_AUTHORITIES.validity, NOW()),
                            'authority_created_on', AUTHORITIES.created_on,
                            'authority_updated_at', AUTHORITIES.updated_at
                        )
                    ) as authorities
                FROM ROLE_AUTHORITIES
                JOIN AUTHORITIES ON ROLE_AUTHORITIES.authority_id = AUTHORITIES.id AND AUTHORITIES.active = TRUE
                WHERE ROLE_AUTHORITIES.active = TRUE
                GROUP BY ROLE_AUTHORITIES.role_id
            ) role_authorities ON ROLES.id = role_authorities.role_id
            WHERE USERS.id = ? AND USERS.active = TRUE
            GROUP BY USERS.id, USERS.full_name, USERS.email, USERS.phone, USERS.address, USERS.wallet, USERS.active, USERS.created_on, USERS.updated_at`,
        [userId]
    ).catch((error) => {
        logger.error(`getUserRolesAuthoritiesByUserId: ${error}`);
        return null;
    });
}

module.exports = {
    getUserRolesAuthoritiesByUserId,
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
};
