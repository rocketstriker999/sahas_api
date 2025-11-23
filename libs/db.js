// config/database.js
const mysql = require("mysql2");
const { logger } = require("sahas_utils");

// Create a connection pool
const dbConnectionPool = mysql.createPool({
    host: process.env.MYSQL_DB_HOST, // MySQL server address (could be an IP address or 'localhost')
    user: process.env.MYSQL_DB_USERNAME, // MySQL username
    password: process.env.MYSQL_DB_PASSWORD, // MySQL password
    database: process.env.MYSQL_DB_NAME, // Name of the database
    waitForConnections: true, // Enable queuing of requests if the pool is busy
    connectionLimit: 10, // Max number of connections in the pool
    queueLimit: 0, // Unlimited number of requests in the queue -1
    dateStrings: true,
});

//Users table modification -  added updated_at column
//is_allowed_to_login

function generateDBTables() {
    const createUserTableQuery = [
        `CREATE TABLE IF NOT EXISTS USERS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(36) NULL,
            email VARCHAR(48) NOT NULL UNIQUE,
            phone VARCHAR(13) NULL UNIQUE,
            image VARCHAR(64) NULL UNIQUE,
            address VARCHAR(256) NULL,
            branch_id INT NULL,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            created_by INT NULL
          )
        `,
        `CREATE TABLE IF NOT EXISTS WALLET_TRANSACTIONS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            amount INT NOT NULL,
            note VARCHAR(256) NOT NULL,
            created_by INT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
        `CREATE TABLE IF NOT EXISTS ROLES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(36) UNIQUE NOT NULL,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            created_by INT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS AUTHORITIES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(36) UNIQUE NOT NULL,
            description VARCHAR(128) NOT NULL,
            created_by INT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS ROLE_AUTHORITIES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            role_id INT NOT NULL,
            authority_id INT NOT NULL,
            created_by INT  NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS USER_ROLES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            role_id INT NOT NULL,
            created_by INT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
        `CREATE TABLE IF NOT EXISTS AUTHENTICATION_TOKENS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            otp VARCHAR(4) NOT NULL,
            token VARCHAR(36) NULL UNIQUE,
            active BOOLEAN NOT NULL DEFAULT FALSE,
            validity DATETIME NOT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,
        `CREATE TABLE IF NOT EXISTS USER_DEVICES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            finger_print VARCHAR(256) NOT NULL,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )`,
        `CREATE TABLE IF NOT EXISTS BRANCHES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(56) NOT NULL,
            address VARCHAR(128) NOT NULL,
            description VARCHAR(256) NOT NULL,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `,
        `CREATE TABLE IF NOT EXISTS INQUIRIES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            created_by INT NOT NULL,
            branch_id INT NOT NULL,
            course_id INT NOT NULL,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS INQUIRY_NOTES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            inquiry_id INT NOT NULL,
            note VARCHAR(256) NOT NULL,
            created_by INT NOT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS ENROLLMENTS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            end_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            amount DECIMAL(8, 2) DEFAULT 0,
            on_site_access BOOLEAN NOT NULL DEFAULT TRUE,
            digital_access BOOLEAN NOT NULL DEFAULT TRUE,
            created_by INT NOT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `,
        `CREATE TABLE IF NOT EXISTS ENROLLMENT_COURSES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            enrollment_id INT NOT NULL,
            course_id INT NOT NULL,
            created_by INT NOT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,
        `CREATE TABLE IF NOT EXISTS ENROLLMENT_TRANSACTIONS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            enrollment_id INT NOT NULL,
            amount DECIMAL(8, 2) DEFAULT 0,
            cgst DECIMAL(8, 2) DEFAULT 0,
            sgst DECIMAL(8, 2) DEFAULT 0,
            original DECIMAL(8, 2) AS (amount - cgst - sgst) STORED,
            coupon_code VARCHAR(16) NULL,
            discount DECIMAL(8, 2) DEFAULT 0,
            note VARCHAR(256) NOT NULL,
            type VARCHAR(16) NOT NULL,
            image VARCHAR(64) NULL UNIQUE,
            invoice VARCHAR(64) NULL,
            created_by INT NOT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS COURSE_CATEGORIES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(96) NOT NULL UNIQUE,
            image VARCHAR(64) NULL,
            view_index INT NOT NULL DEFAULT 0,
            active BOOLEAN NOT NULL DEFAULT TRUE
        )`,
        `CREATE TABLE IF NOT EXISTS COURSES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            category_id INT NOT NULL,
            title VARCHAR(96) NOT NULL UNIQUE,
            description VARCHAR(256) NOT NULL,
            image VARCHAR(64) NULL,
            fees DECIMAL(8, 2) DEFAULT 0,
            whatsapp_group VARCHAR(64) NULL,
            validity INT NOT NULL DEFAULT 365,
            view_index INT NOT NULL DEFAULT 0,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS SUBJECTS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(96) NOT NULL UNIQUE,
            background_color VARCHAR(32) ,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS COURSE_SUBJECTS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT NOT NULL,
            subject_id INT NOT NULL,
            view_index INT NOT NULL DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS SUBJECT_CHAPTERS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject_id INT NOT NULL,
            title VARCHAR(128) NOT NULL UNIQUE,
            type INT NOT NULL,
            view_index INT NOT NULL DEFAULT 0,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS CHAPTER_TYPES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(128) NOT NULL UNIQUE,
            view_index INT NULL,
            requires_enrollment_digital_access BOOLEAN DEFAULT TRUE,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS COUPON_CODES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(16) UNIQUE,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS COUPON_CODE_COURSES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            coupon_code_id INT NOT NULL,
            course_id INT NOT NULL,
            discount DECIMAL(8, 2) NOT NULL DEFAULT 0,
            discount_type VARCHAR(12)  DEFAULT '₹',
            distributor_email VARCHAR(48)  NULL,
            commision DECIMAL(8, 2) NOT NULL DEFAULT 0,
            commision_type VARCHAR(12)  DEFAULT '₹',
            validity INT  NOT NULL DEFAULT 0,
            validity_type VARCHAR(12)  DEFAULT 'EXTEND',
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS CHAPTER_MEDIA (
            id INT AUTO_INCREMENT PRIMARY KEY,
            chapter_id INT NOT NULL,
            title VARCHAR(96) NOT NULL,
            cdn_url VARCHAR(64) NULL UNIQUE,
            type VARCHAR(16) NOT NULL,
            external_url VARCHAR(128) NULL,
            view_index INT NOT NULL DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,

        // `INSERT INTO BRANCHES (id, title, address, description, active, created_on, updated_at) VALUES
        // (1, 'Head Office', '123 Main Street, Mumbai', 'Main corporate branch', 1, '2025-08-10 23:05:32', '2025-08-10 23:05:32'),
        // (2, 'Ahmedabad Branch', '45 Riverfront Road, Ahmedabad', 'Serves Gujarat region', 1, '2025-08-10 23:05:32', '2025-08-10 23:05:32'),
        // (3, 'Bangalore Branch', '88 MG Road, Bangalore', 'South India operations', 1, '2025-08-10 23:05:32', '2025-08-10 23:05:32'),
        // (4, 'Pune Branch', '21 Koregaon Park, Pune', 'West region service hub', 0, '2025-08-10 23:05:32', '2025-08-10 23:05:32'),
        // (5, 'Delhi Branch', '10 Connaught Place, Delhi', 'North India operations', 1, '2025-08-10 23:05:32', '2025-08-10 23:05:32');

        // INSERT INTO AUTHORITIES (title, description) VALUES
        // ('USE_CONTAINER_APP', 'test'),
        // ('USE_PAGE_DASHBOARD', 'test'),
        // ('USE_FEATURE_CAROUSEL', 'test'),
        // ('USE_FEATURE_PROFILE_CARD', 'test'),
        // ('USE_FEATURE_OPERATIONS', 'test'),
        // ('USE_PAGE_COURSES', 'test'),
        // ('USE_CONTAINER_MANAGE_USERS', 'test'),
        // ('USE_PAGE_WALLET', 'test'),
        // ('USE_PAGE_MANAGE_CAROUSEL', 'test'),
        // ('USE_PAGE_MANAGE_BRANCHES', 'test'),
        // ('USE_PAGE_MANAGE_CONFIGS', 'test'),
        // ('USE_PAGE_MANAGE_ADMINS', 'test'),
        // ('USE_PAGE_TASKS', 'test'),
        // ('USE_PAGE_MANAGE_TASKS', 'test'),
        // ('USE_PAGE_MANAGE_COUPON_CODES', 'test'),
        // ('USE_PAGE_REVENUE', 'test'),
        // ('USE_PAGE_MANAGE_DEVICES', 'test'),
        // ('USE_FEATURE_USERS_SEARCH', 'test'),
        // ('USE_PAGE_USERS', 'test'),
        // ('USE_PAGE_USER', 'test'),
        // ('WRITE_USERS_BASICS', 'test'),
        // ('READ_USERS_BASICS', 'test'),
        // ('USE_PAGE_EXAM', 'allows to use exam page'),
        // ('USE_PAGE_INVOICES', 'allows user to use invoice page');

        // INSERT INTO ROLES (title) VALUES ('DEVELOPER');

        // INSERT INTO ROLE_AUTHORITIES (role_id, authority_id) SELECT 1, id FROM AUTHORITIES;

        // INSERT INTO USERS (full_name, email ) VALUES ('Nisarg', 'hammerbyte.nisarg@gmail.com');
        // INSERT INTO USER_ROLES (user_id, role_id) VALUES (1, 1);`,
    ];

    return Promise.all(createUserTableQuery.map((query) => executeSQLQueryRaw(query)));
}

// Utility function to execute SQL queries using promises
function executeSQLQueryRaw(query) {
    return new Promise((resolve, reject) => {
        dbConnectionPool.getConnection((error, dbConnection) => {
            if (error) {
                logger.error(`Database Connection Failed ${error.message}`);
            } else {
                dbConnection.query(query, (error, result) => {
                    logger.info(`Executing ${query}`);
                    if (error) {
                        console.error("FAILED - ", query, error);
                        reject(error); // Reject the promise if the query fails
                    } else {
                        resolve(result); // Resolve the promise if the query succeeds
                    }
                    dbConnection.release();
                });
            }
        });
    });
}

function executeSQLQueryParameterized(query, parameters) {
    return new Promise((resolve, reject) => {
        dbConnectionPool.getConnection((error, dbConnection) => {
            if (error) {
                logger.error(`Database Connection Failed ${error.message}`);
            } else {
                dbConnection.execute(query, parameters, (error, result) => {
                    logger.info(`Executing ${query} [${parameters}]`);
                    if (error) {
                        reject(error); // Reject the promise if the query fails
                        console.error("FAILED - ", query, error);
                    } else {
                        resolve(result); // Resolve the promise if the query succeeds
                    }
                    dbConnection.release();
                });
            }
        });
    });
}

// Export the pool to use in other files
module.exports = { generateDBTables, executeSQLQueryRaw, executeSQLQueryParameterized };
