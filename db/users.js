const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//tested
function getUserByEmail({ email }) {
    return executeSQLQueryParameterized(`SELECT * FROM USERS WHERE email=?`, [email])
        .then((user) => (user && user.length > 0 ? user[0] : false))
        .catch((error) => {
            logger.error(`getUserByEmail: ${error}`);
            return false;
        });
}

//tested
function addDefaultRoleToUser(userId) {
    return executeSQLQueryParameterized(`INSERT INTO USER_ROLES(user_id,role_id) VALUES(?,1)`, [userId]).catch((error) => {
        logger.error(`addDefaultRoleToUser: ${error}`);
        return false;
    });
}

//tested
function addUserByEmail(email) {
    return executeSQLQueryParameterized(`INSERT IGNORE INTO USERS(email) VALUES(?)`, [email])
        .then((result) => result?.affectedRows && addDefaultRoleToUser(result?.insertId))
        .catch((error) => {
            logger.error(`addUserByEmail: ${error}`);
            return false;
        });
}

function getUserByAuthenticationToken(token) {
    return (
        token &&
        executeSQLQueryParameterized(
            `SELECT USERS.* FROM AUTHENTICATION_TOKENS INNER JOIN USERS ON AUTHENTICATION_TOKENS.user_id=USERS.id  WHERE AUTHENTICATION_TOKENS.token=?`,
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
            return [];
        });
}

//freeze
function getUserById({ id }) {
    return executeSQLQueryParameterized(`SELECT * FROM USERS WHERE id = ?`, [id])
        .then((results) => (results.length > 0 ? results[0] : null))
        .catch((error) => logger.error(`getUserById: ${error}`));
}

function getAuthoritiesByRoleIds(roleIds) {
    return executeSQLQueryParameterized(
        `SELECT AUTHORITIES.title FROM ROLE_AUTHORITIES LEFT JOIN AUTHORITIES ON ROLE_AUTHORITIES.authority_id=AUTHORITIES.id WHERE ROLE_AUTHORITIES.role_id in (${roleIds})`
    ).catch((error) => {
        logger.error(`getAuthoritiesByRoleIds: ${error}`);
        return [];
    });
}

function prepareSearchLikeQuery(search, query) {
    if (!!search) {
        query.push("WHERE");
        query.push(["full_name", "email", "phone"].map((key) => `${key} LIKE '%${search}%'`).join(" OR "));
    }
}

function prepareFiltersWhereQuery(appliedFilters, search, query) {
    if (Object.keys(appliedFilters).length) {
        //if priviously search is applied then we need to add AND
        query.push(!!search ? "AND" : "WHERE");

        const { roles, branches, active } = appliedFilters;

        const filterQueries = [];

        if (roles) {
            filterQueries.push(`USER_ROLES.role_id in (${roles})`);
        }

        if (branches) {
            filterQueries.push(`USERS.branch_id in (${branches})`);
        }

        if (active) {
            filterQueries.push(`USERS.active in (${active})`);
        }

        query.push(filterQueries.join(" AND "));
    }
}

function getAllUsersBySearchAndFilters(search, appliedFilters, offSet, limit) {
    const query = [`SELECT DISTINCT USERS.* FROM USERS LEFT JOIN USER_ROLES ON USERS.id=USER_ROLES.user_id`];
    const parameters = [];

    prepareSearchLikeQuery(search, query);

    prepareFiltersWhereQuery(appliedFilters, search, query);

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

    prepareSearchLikeQuery(search, query);

    prepareFiltersWhereQuery(appliedFilters, search, query, parameters);

    return executeSQLQueryParameterized(query.join(" "), parameters)
        .then(([result]) => result.count)
        .catch((error) => {
            logger.error(`getCountUsersBySearchAndFilters: ${error}`);
            return 0;
        });
}

//freeze
function updateUserById({ id, email, full_name, phone, image, address, branch_id, active }) {
    return executeSQLQueryParameterized(`UPDATE USERS SET email=?, full_name=?,phone=?,image=?,address=?,branch_id=?,active=? WHERE id = ?`, [
        email,
        full_name,
        phone,
        image || null,
        address,
        branch_id,
        active,
        id,
    ]).catch((error) => logger.error(`updateUserById: ${error}`));
}

//freeze
function patchUserFullNameById({ id, full_name }) {
    return executeSQLQueryParameterized(`UPDATE USERS SET full_name=? WHERE id = ?`, [full_name, id]).catch((error) =>
        logger.error(`patchUserFullNameById: ${error}`)
    );
}

//freeze
function patchUserPhoneById({ id, phone }) {
    return executeSQLQueryParameterized(`UPDATE USERS SET phone=? WHERE id = ?`, [phone, id]).catch((error) => logger.error(`patchUserPhoneById: ${error}`));
}

//tested
function addUser({ email, full_name, phone, image, address, branch_id }) {
    return executeSQLQueryParameterized(`INSERT  INTO USERS(email,full_name, phone, image, address, branch_id) VALUES(?,?,?,?,?,?)`, [
        email,
        full_name,
        phone,
        image,
        address,
        branch_id,
    ])
        .then((result) => {
            result?.affectedRows && addDefaultRoleToUser(result?.insertId);
            return result?.insertId;
        })
        .catch((error) => logger.error(`addUser: ${error}`));
}

module.exports = {
    getAllUsersBySearchAndFilters,
    getCountUsersBySearchAndFilters,
    validateUserOTP,
    getUserByEmail,
    getUserByAuthenticationToken,
    getGroupsById,
    getAuthoritiesById,
    getUserByTransactionId,
    addUserByEmail,
    getUserById,
    getAuthoritiesByRoleIds,
    updateUserById,
    addUser,
    patchUserFullNameById,
    patchUserPhoneById,
    patchUserRecentDeviceById,
};
