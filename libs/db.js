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
    queueLimit: 0, // Unlimited number of requests in the queue
});

function generateDBTables() {
    const createUserTableQuery = [
        `CREATE TABLE IF NOT EXISTS USERS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(36) NULL,
            email VARCHAR(48) NOT NULL UNIQUE,
            phone VARCHAR(13) NULL UNIQUE,
            address VARCHAR(256) NULL,
            branch VARCHAR(16) NULL,
            wallet DECIMAL(8, 2) DEFAULT 0,
            otp VARCHAR(4) NOT NULL,
            token VARCHAR(36) NULL UNIQUE,
            is_blocked BOOLEAN DEFAULT FALSE,
            created_on DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `,
        `CREATE TABLE IF NOT EXISTS USER_GROUPS(user_id INT NOT NULL,title VARCHAR(36) NOT NULL)`,
        `CREATE TABLE IF NOT EXISTS USER_AUTHORITIES(user_id INT NOT NULL,title VARCHAR(36) NOT NULL)`,
        `CREATE TABLE IF NOT EXISTS USER_DEVICES (
            user_id INT NOT NULL,
            os VARCHAR(16) NOT NULL,
            company VARCHAR(16) NOT NULL,
            browser VARCHAR(16) NOT NULL,
            active BOOLEAN DEFAULT FALSE
          )
        `,
        `CREATE TABLE IF NOT EXISTS USER_USAGE(user_id INT NOT NULL,activity VARCHAR(16) NOT NULL,time_stamp DATETIME DEFAULT CURRENT_TIMESTAMP)`,
        `CREATE TABLE IF NOT EXISTS USER_INVOICES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            transaction_id INT NOT NULL,
            downloadable BOOLEAN DEFAULT TRUE
            )
        `,
        `CREATE TABLE IF NOT EXISTS CATEGORIES(id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(100) NOT NULL UNIQUE)`,

        `CREATE TABLE IF NOT EXISTS PRODUCTS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(128) NOT NULL,
            description VARCHAR(256) NOT NULL,
            image VARCHAR(32) NOT NULL UNIQUE,
            price DECIMAL(8, 2) NOT NULL,
            discounted DECIMAL(8, 2) NOT NULL,
            category_id INT NOT NULL
          )`,
        `CREATE TABLE IF NOT EXISTS MAPPING_PRODUCT_COURSES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            course_id INT NOT NULL
        )`,

        `CREATE TABLE IF NOT EXISTS COURSES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(128) NOT NULL
          )`,
        `CREATE TABLE IF NOT EXISTS MAPPING_COURSE_SUBJECTS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            course_id INT NOT NULL,
            subject_id INT NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS SUBJECTS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(128) NOT NULL,
            demo_content_id INT NULL
          )`,

        `CREATE TABLE IF NOT EXISTS MAPPING_SUBJECT_CHAPTERS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            subject_id INT NOT NULL,
            chapter_id INT NOT NULL
        )`,

        `CREATE TABLE IF NOT EXISTS CHAPTERS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(128) NOT NULL,
            content_id INT NULL
        )`,

        `CREATE TABLE IF NOT EXISTS CONTENT_VIDEOS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(128) NOT NULL,
            content_id INT NULL,
            yt_id VARCHAR(16) NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS CONTENT_AUDIOS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(128) NOT NULL,
            content_id INT NULL,
            source VARCHAR(16) NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS CONTENT_PDFS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(128) NOT NULL,
            content_id INT NULL,
            gd_id VARCHAR(32) NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS USER_TRANSACTIONS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            status VARCHAR(16) DEFAULT 'IN_PROGRESS',
            price DECIMAL(8, 2) DEFAULT 0,
            discounted DECIMAL(8, 2) DEFAULT 0,
            coupon_id VARCHAR(16) DEFAULT NULL,
            benifit DECIMAL(8, 2) DEFAULT 0,
            sgst DECIMAL(8, 2) DEFAULT 0,
            cgst DECIMAL(8, 2) DEFAULT 0,
            pay DECIMAL(8, 2) DEFAULT 0,
            hash VARCHAR(128) NULL
        )`,
        `CREATE TABLE IF NOT EXISTS USER_PRODUCT_ACCESSES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            transaction_id INT NOT NULL,
            validity DATETIME NOT NULL,
            active BOOLEAN NOT NULL DEFAULT TRUE
        )`,
        `CREATE TABLE IF NOT EXISTS COUPONS (
            id VARCHAR(8) PRIMARY KEY,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            benifit DECIMAL(8, 2) NOT NULL DEFAULT 0,
            benifit_type VARCHAR(12)  DEFAULT 'PERCENTAGE',
            validity DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            beneficiary_user_id INT DEFAULT 0,
            beneficiary_benifit DECIMAL(8, 2) DEFAULT 0,
            beneficiary_benifit_type VARCHAR(12) DEFAULT 'PERCENTAGE'
        )`,
        `CREATE TABLE IF NOT EXISTS MAPPING_COUPON_PRODUCTS (
            coupon_id VARCHAR(8) NOT NULL,
            product_id INT NOT NULL
        )`,
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
                    console.log(`Executing ${query}`);
                    if (error) {
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
                        logger.error(error);
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

// Export the pool to use in other files
module.exports = { generateDBTables, executeSQLQueryRaw, executeSQLQueryParameterized };
