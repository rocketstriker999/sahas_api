const { executeSQLQueryParameterized } = require("../libs/db");
const { logger } = require("sahas_utils");

//freeze
function addInquiry({ user_id, created_by, branch_id, course_id }) {
    return executeSQLQueryParameterized("INSERT INTO INQUIRIES(user_id,created_by,branch_id,course_id) VALUES(?,?,?,?)", [
        user_id,
        created_by,
        branch_id,
        course_id,
    ])
        .then((result) => result.insertId)
        .catch((error) => {
            logger.error(`addInquiry: ${error}`);
        });
}

//freeze
function updateInquiryById({ id, active, branch_id, course_id }) {
    return executeSQLQueryParameterized("UPDATE INQUIRIES SET active=?,branch_id=?,course_id=? where id=?", [active, branch_id, course_id, id]).catch(
        (error) => {
            logger.error(`updateInquiryById: ${error}`);
        },
    );
}

//freeze
function getInquiriesByUserId({ user_id }) {
    return executeSQLQueryParameterized(
        "SELECT INQUIRIES.*, USERS.full_name AS created_by_full_name FROM INQUIRIES LEFT JOIN USERS ON INQUIRIES.created_by = USERS.id  WHERE INQUIRIES.user_id = ? GROUP BY INQUIRIES.id ORDER BY INQUIRIES.id DESC",
        [user_id],
    ).catch((error) => {
        logger.error(`getInquiriesByUserId: ${error}`);
        return [];
    });
}

//freeze
function getInquiryById({ id }) {
    return executeSQLQueryParameterized(
        "SELECT INQUIRIES.*, USERS.full_name AS created_by_full_name  FROM INQUIRIES LEFT JOIN USERS ON INQUIRIES.created_by = USERS.id  WHERE INQUIRIES.id = ? GROUP BY INQUIRIES.id ",
        [id],
    )
        .then((result) => (result.length > 0 ? result[0] : false))
        .catch((error) => {
            logger.error(`getInquiryById: ${error}`);
        });
}

//freeze
function deleteInquiryById({ id }) {
    return executeSQLQueryParameterized("DELETE  FROM INQUIRIES WHERE id=?", [id]).catch((error) => {
        logger.error(`deleteInquiryById: ${error}`);
        return [];
    });
}

function prepareSearchLikeQuery(search, query) {
    if (!!search) {
        query.push("WHERE");
        query.push(`(${["full_name", "email", "phone"].map((key) => `${key} LIKE '%${search}%'`).join(" OR ")})`);
    }
}

function prepareFiltersWhereQuery(appliedFilters, search, query) {
    const { roles, branches, active, courses } = appliedFilters;

    if (roles || branches || active || courses) {
        //if priviously search is applied then we need to add AND
        query.push(!!search ? "AND" : "WHERE");

        const filterQueries = [];

        if (branches) {
            filterQueries.push(`INQUIRIES.branch_id in (${branches})`);
        }

        if (active) {
            filterQueries.push(`INQUIRIES.active in (${active})`);
        }

        if (courses) {
            filterQueries.push(`INQUIRIES.course_id in (${courses})`);
        }

        query.push(filterQueries.join(" AND "));
    }
}

function prepareOrderByQuery(appliedFilters, query) {
    const { id } = appliedFilters;

    if (id) {
        query.push("ORDER BY");

        const orderByQueries = [];

        if (!!id) {
            orderByQueries.push(`INQUIRIES.id ${id}`);
        }

        query.push(orderByQueries.join(" , "));
    } else {
        //default sorting order if no sorting is given
        query.push("ORDER BY INQUIRIES.id DESC");
    }
}

async function getAllInquiriesBySearchAndFilters(search, appliedFilters, offSet, limit) {
    const query = [
        `SELECT DISTINCT INQUIRIES.*, USERS.id AS user_id,USERS.email,USERS.full_name,USERS.phone,CREATED_BY_USERS.full_name AS created_by_full_name FROM INQUIRIES LEFT JOIN USERS ON INQUIRIES.user_id = USERS.id LEFT JOIN USERS CREATED_BY_USERS ON INQUIRIES.created_by = CREATED_BY_USERS.id`,
    ];
    const parameters = [];

    prepareSearchLikeQuery(search, query);
    prepareFiltersWhereQuery(appliedFilters, search, query);
    prepareOrderByQuery(appliedFilters, query);

    if (offSet && limit) {
        query.push(`LIMIT ?`);
        parameters.push(limit);
        query.push(`OFFSET ?`);
        parameters.push(offSet);
    }

    return await executeSQLQueryParameterized(query.join(" "), parameters);
}

function getCountInquiriesBySearchAndFilters(search, appliedFilters) {
    const query = [`SELECT COUNT(DISTINCT INQUIRIES.id) AS count FROM INQUIRIES LEFT JOIN USERS ON INQUIRIES.user_id=USERS.id`];
    const parameters = [];

    prepareSearchLikeQuery(search, query);
    prepareFiltersWhereQuery(appliedFilters, search, query, parameters);

    return executeSQLQueryParameterized(query.join(" "), parameters)
        .then(([result]) => result.count)
        .catch((error) => {
            logger.error(`getCountInquiriesBySearchAndFilters: ${error}`);
            return 0;
        });
}

module.exports = {
    getInquiriesByUserId,
    deleteInquiryById,
    addInquiry,
    getInquiryById,
    updateInquiryById,
    getAllInquiriesBySearchAndFilters,
    getCountInquiriesBySearchAndFilters,
};
