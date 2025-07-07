const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Login & Role Management API',
            version: '1.0.0',
            description: 'API untuk manajemen login, role, dan akses menu',
        },
        servers: [
            {
                url: 'http://localhost:9999',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./src/routes/*.js'], // Path ke file yang akan di-scan swagger
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
