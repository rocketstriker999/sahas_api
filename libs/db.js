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

// prepareTables(connection)
//     .then(() => {
//         logger.success("Tables Ready"); // Always release the connection after operations are done
//     })
//     .catch((error) => {
//         logger.error(`Error while preparing tables: ${error.message}`); // Release connection even on error
//     })
//     .finally(() => connection.release());

// Function to prepare tables (async)

function generateDBTables() {
    const createUserTableQuery = [
        `CREATE TABLE IF NOT EXISTS USERS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE
          )
        `,
        `CREATE TABLE IF NOT EXISTS PRODUCTS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            price DECIMAL(10, 2) NOT NULL
          )`,
        `CREATE TABLE IF NOT EXISTS CATEGORIES (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            image DECIMAL(10, 2) NOT NULL
          )`,
    ];

    return Promise.all(createUserTableQuery.map((query) => executeSQLQuery(query)));
}

// Utility function to execute SQL queries using promises
function executeSQLQuery(query) {
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

// Export the pool to use in other files
module.exports = { generateDBTables, executeSQLQuery };
