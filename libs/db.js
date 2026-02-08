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

async function generateDBTables() {
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
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_role_authority (role_id, authority_id)
        )`,
        `CREATE TABLE IF NOT EXISTS USER_ROLES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            role_id INT NOT NULL,
            created_by INT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_user_role (user_id, role_id)
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
            handler  VARCHAR(256) NOT NULL,
            created_by INT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `,
        `CREATE TABLE IF NOT EXISTS ENROLLMENT_COURSES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            enrollment_id INT NOT NULL,
            course_id INT NOT NULL,
            created_by INT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY unique_user_course (enrollment_id, course_id)
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
            image VARCHAR(128) NULL UNIQUE,
            invoice VARCHAR(128) NULL,
            created_by INT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS COURSE_CATEGORIES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(96) NOT NULL UNIQUE,
            image VARCHAR(128) NULL,
            view_index INT NOT NULL DEFAULT 0,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS COURSES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            category_id INT NOT NULL,
            title VARCHAR(96) NOT NULL,
            description VARCHAR(256) NOT NULL,
            image VARCHAR(128) NULL,
            fees DECIMAL(8, 2) DEFAULT 0,
            whatsapp_group VARCHAR(128) NULL,
            validity INT NOT NULL DEFAULT 365,
            view_index INT NOT NULL DEFAULT 0,
            is_bundle BOOLEAN NOT NULL DEFAULT FALSE,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_category_title (category_id, title)
        )`,
        `CREATE TABLE IF NOT EXISTS BUNDLED_COURSES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT NOT NULL,
            bundled_course_id INT NOT NULL,
            UNIQUE KEY unique_course_bundled_course (course_id, bundled_course_id)
        )`,
        `
        CREATE TABLE IF NOT EXISTS COURSE_DIALOG(
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT NOT NULL,
            title VARCHAR(96) NOT NULL,
            heading VARCHAR(96) NOT NULL,
            description VARCHAR(256) NOT NULL,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            media_url VARCHAR(128) NULL UNIQUE,
            redirect_url VARCHAR(256) NOT NULL
        )
        `,
        `CREATE TABLE IF NOT EXISTS SUBJECTS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(96) NOT NULL,
            background_color VARCHAR(32) DEFAULT NULL,
            test_timer_minutes INT DEFAULT NULL,
            test_size INT DEFAULT NULL,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS COURSE_SUBJECTS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT NOT NULL,
            subject_id INT NOT NULL,
            view_index INT NOT NULL DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_course_subject (course_id, subject_id)
        )`,
        `CREATE TABLE IF NOT EXISTS SUBJECT_CHAPTERS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject_id INT NOT NULL,
            title VARCHAR(128) NOT NULL,
            type INT NOT NULL,
            test_attainable BOOL DEFAULT FALSE,
            test_questions_pool VARCHAR(128) NULL UNIQUE,
            view_index INT NOT NULL DEFAULT 0,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_subject_title (subject_id, title)
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
            cdn_url VARCHAR(128) NOT NULL,
            type VARCHAR(16) NOT NULL,
            external_url VARCHAR(128) NULL,
            downloadable BOOLEAN NOT NULL DEFAULT FALSE,
            view_index INT NOT NULL DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_chapter_type_title (chapter_id,type, title)
        )`,
        `INSERT IGNORE INTO BRANCHES (id, title, address, description, active, created_on, updated_at) VALUES
        (1, 'Head Office', '123 Main Street, Mumbai', 'Main corporate branch', 1, '2025-08-10 23:05:32', '2025-08-10 23:05:32'),
        (2, 'Ahmedabad Branch', '45 Riverfront Road, Ahmedabad', 'Serves Gujarat region', 1, '2025-08-10 23:05:32', '2025-08-10 23:05:32'),
        (3, 'Bangalore Branch', '88 MG Road, Bangalore', 'South India operations', 1, '2025-08-10 23:05:32', '2025-08-10 23:05:32')`,

        `INSERT IGNORE INTO CHAPTER_TYPES (title, view_index,requires_enrollment_digital_access) VALUES
        ('Demo', 0,FALSE),
        ('Topics', 1,TRUE)`,

        `INSERT IGNORE INTO AUTHORITIES (title, description) VALUES
        ('MANAGE_OTHER_USERS', 'Manage Other User Profile'),
        ('MANAGE_COURSES', 'Manage Course Content'),

        ('MANAGE_USER_INQUIRIES', 'Manage User Inquiries'),
        ('MANAGE_FEATURE_CAROUSEL', 'Manage Carousel Items'),
        ('USE_EMPLOYEE_CORNER', 'Employee Corner Visibility'),
        ('USE_CONTAINER_MANAGE_USERS', 'Use User Management Container'),
        ('USE_PAGE_MY_EXPENSES', 'Page For Expense Submission'),
        ('USE_PAGE_MANAGE_EXAMS', 'Page For Exam Paper'),
        ('USE_ADMIN_CORNER', 'Admin Corner Visibility'),
        ('USE_PAGE_MANAGE_EXAMS', 'Page For Exam Paper'),
        ('USE_PAGE_MANAGE_BRANCHES', 'Page For Managing Branches'),
        ('USE_PAGE_MANAGE_STREAMING_DEVICES_REQUESTS', 'Page For Managing Streaming Device Requests'),
        ('USE_PAGE_FINANCIALS', 'Page For Managing Financials'),
        ('USE_PAGE_ANALYTICS', 'Page For Analytics'),
        ('USE_PAGE_CHAPTERIZATION', 'Page For Managing Chapter Types'),
        ('USE_PAGE_COUPON_CODES', 'Page For Managing Coupon Codes'),
        ('USE_DEVELOPER_CORNER', 'Developer Corner Visibility'),
        ('USE_CONTAINER_MANAGE_USERS', 'Use User Management Container'),
        ('USE_PAGE_USERS', 'Use User Search Page'),
        ('USE_CONTAINER_USER', 'Use User Profile Container'),
        ('WRIE_USER_BASICS', 'Write User Basic Profile'),
        ('READ_USER_INQUIRIES', 'View User Inquiries'),
        ('READ_USER_ENROLLMENTS', 'View User Enrollments'),
        ('READ_USER_STREAMING_DEVICES', 'View User Streaming Devices'),
        ('READ_USER_WALLET', 'View User Wallet'),
        ('READ_USER_GLOBAL_NOTES', 'View User Global Notes'),
        ('READ_USER_ROLES', 'View User Roles'),
        ('UPDATE_CHAPTERS', 'Update Chapters')`,

        `INSERT IGNORE INTO ROLES (title) VALUES ('STUDENT')`,
        `INSERT IGNORE INTO ROLES (title) VALUES ('DEVELOPER')`,

        `INSERT IGNORE INTO ROLE_AUTHORITIES (role_id, authority_id) SELECT 2, id FROM AUTHORITIES`,

        `INSERT IGNORE  INTO USERS (full_name, email ) VALUES ('Nisarg', 'hammerbyte.nisarg@gmail.com');`,
        `INSERT IGNORE INTO USER_ROLES (user_id, role_id) VALUES (1, 2);`,
        `INSERT IGNORE INTO USER_ROLES (user_id, role_id) VALUES (3, 2);`,
        `INSERT IGNORE INTO USER_ROLES (user_id, role_id) VALUES (5, 2);`,
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
