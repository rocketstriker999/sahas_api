const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Sahas API Documentation",
            version: "1.0.0",
            description: "API documentation for the Sahas project, covering template configurations, authentication tokens, and course categories.",
        },
        servers: [
            {
                url: `http://localhost:${process.env.SERVER_PORT || 3000}`,
                description: "Local server",
            },
        ],
        components: {
            securitySchemes: {
                AuthenticationToken: {
                    type: "apiKey",
                    in: "header",
                    name: "authentication-token",
                    description: "User authentication token",
                },
                DeviceFingerPrint: {
                    type: "apiKey",
                    in: "header",
                    name: "device-finger-print",
                    description: "Device fingerprint for identification",
                },
            },
        },
        security: [
            {
                DeviceFingerPrint: [],
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
