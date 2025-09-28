// config/database.js
const mysql = require("mysql2");
const logger = require("./logger");

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
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
           
        )`,
        `CREATE TABLE IF NOT EXISTS AUTHORITIES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(36) UNIQUE NOT NULL,
            description VARCHAR(128) NOT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS ROLE_AUTHORITIES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            role_id INT NOT NULL,
            authority_id INT NOT NULL,
            created_by INT NOT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS USER_ROLES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            role_id INT NOT NULL,
            created_by INT NOT NULL,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
        `CREATE TABLE IF NOT EXISTS USER_AUTHENTICATION_TOKENS (
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
            fees DECIMAL(8, 2) DEFAULT 0,
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
            created_by INT NOT NULL,
            note VARCHAR(256) NOT NULL,
            type VARCHAR(16) NOT NULL,
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
            view_index INT NOT NULL DEFAULT 0,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS SUBJECTS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(96) NOT NULL UNIQUE,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE IF NOT EXISTS COURSES_SUBJECTS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT NOT NULL,
            subject_id INT NOT NULL,
            view_index INT NOT NULL DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            
        )`,

        // `CREATE TABLE IF NOT EXISTS SUBJECT_CHAPTERS(
        //     id INT AUTO_INCREMENT PRIMARY KEY,
        //     subject_id INT NOT NULL,
        //     title VARCHAR(128) NOT NULL UNIQUE,
        //     media_group_id CHAR(36) DEFAULT (UUID()) UNIQUE,
        //     view_index INT NULL,
        //     active BOOLEAN NOT NULL DEFAULT TRUE,
        //     created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
        //     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        // )`,
        // `CREATE TABLE IF NOT EXISTS MEDIA(
        //     id INT AUTO_INCREMENT PRIMARY KEY,
        //     title VARCHAR(128) NOT NULL UNIQUE,
        //     media_group_id CHAR(36) NULL,
        //     cdn_id CHAR(48) NOT NULL,
        //     type CHAR(12) NULL,
        //     view_index INT NULL,
        //     downloadable BOOLEAN DEFAULT FALSE
        // )`,
        // `CREATE TABLE IF NOT EXISTS USER_TRANSACTIONS (
        //     id INT AUTO_INCREMENT PRIMARY KEY,
        //     user_id INT NOT NULL,
        //     product_id INT NOT NULL,
        //     status VARCHAR(16) DEFAULT 'IN_PROGRESS',
        //     price DECIMAL(8, 2) DEFAULT 0,
        //     discounted DECIMAL(8, 2) DEFAULT 0,
        //     coupon_id INT DEFAULT NULL,
        //     benifit DECIMAL(8, 2) DEFAULT 0,
        //     sgst DECIMAL(8, 2) DEFAULT 0,
        //     cgst DECIMAL(8, 2) DEFAULT 0,
        //     pay DECIMAL(8, 2) DEFAULT 0,
        //     hash VARCHAR(128) NULL,
        //     invoice CHAR(36) DEFAULT (CONCAT(REPLACE(UUID(), '-', ''), '.pdf')) UNIQUE,
        //     company VARCHAR(36) NULL,
        //     created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
        //     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        // )`,
        // `CREATE TABLE IF NOT EXISTS COUPONS (
        //     id INT AUTO_INCREMENT PRIMARY KEY,
        //     coupon_code VARCHAR(8) UNIQUE,
        //     validity DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        //     active BOOLEAN NOT NULL DEFAULT TRUE
        // )`,
        // `CREATE TABLE IF NOT EXISTS COUPON_COURSES (
        //     coupon_code_id INT NOT NULL,
        //     product_id INT NOT NULL,
        //     product_access_validity DATETIME NULL,
        //     value DECIMAL(8, 2) NOT NULL DEFAULT 0,
        //     type VARCHAR(12)  DEFAULT 'PERCENTAGE'
        // )`,
        // `CREATE TABLE IF NOT EXISTS COUPON_DISTRIBUTORS(
        //     coupon_code_id INT NOT NULL,
        //     user_id INT NOT NULL,
        //     product_id INT NOT NULL,
        //     commision DECIMAL(8, 2) DEFAULT 0,
        //     commision_type VARCHAR(12) DEFAULT 'PERCENTAGE'
        // )`,
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
