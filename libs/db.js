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
        `CREATE TABLE IF NOT EXISTS USER_PURCHASES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            START DATETIME DEFAULT CURRENT_TIMESTAMP,
            END DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `,
        `CREATE TABLE IF NOT EXISTS PRODUCT_CATEGORIES(id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(100) NOT NULL UNIQUE)`,
        `CREATE TABLE IF NOT EXISTS PRODUCTS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(128) NOT NULL,
            price DECIMAL(8, 2) NOT NULL,
            discounted DECIMAL(8, 2) NOT NULL,
            category_id INT NOT NULL
          )`,

        `CREATE TABLE IF NOT EXISTS USER_TRANSACTIONS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            user_id INT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            status VARCHAR(16) DEFAULT 'IN_PROGRESS',
            price DECIMAL(8, 2) DEFAULT 0,
            discounted DECIMAL(8, 2) DEFAULT 0,
            coupon VARCHAR(16) DEFAULT NULL,
            benifit DECIMAL(8, 2) DEFAULT 0,
            sgst DECIMAL(8, 2) DEFAULT 0,
            cgst DECIMAL(8, 2) DEFAULT 0,
            pay DECIMAL(8, 2) NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS USER_PRODUCT_ACCESS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            transaction_id INT NOT NULL,
            validity DATETIME NOT NULL,
            active BOOLEAN NOT NULL DEFAULT TRUE
        );`,

        `INSERT INTO PRODUCTS (title, price, discounted, category_id)
        VALUES ('Product 1', 100.00, 80.00, 1)`,

        `INSERT INTO PRODUCTS (title, price, discounted, category_id)
        VALUES ('Product 2', 150.00, 120.00, 2)`,

        `INSERT INTO PRODUCTS (title, price, discounted, category_id)
        VALUES ('Product 3', 200.00, 180.00, 1)`,

        `INSERT INTO PRODUCTS (title, price, discounted, category_id)
        VALUES ('Product 4', 250.00, 200.00, 3)`,

        `INSERT INTO PRODUCTS (title, price, discounted, category_id)
        VALUES ('Product 5', 50.00, 40.00, 2)`,

        `INSERT INTO USER_GROUPS (user_id, title) VALUES(1, 'USER'),(2, 'HADMIN'),(3, 'FADMIN'),(4, 'USER')`,
        `INSERT INTO USER_AUTHORITIES (user_id, title) VALUES (1, 'read_tickets'), (1, 'write_tickets'), (2, 'read_tickets'), (2, 'write_tickets'), (3, 'read_tickets'), (3, 'write_tickets'), (3, 'update_tickets'), (4, 'read_tickets'), (4, 'delete_tickets')`,
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
