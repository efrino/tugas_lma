const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Login & Role Management API',
            version: '1.0.0',
            description: 'API untuk manajemen login, role, dan akses menu',
            contact: {
                name: 'Your Team',
                email: 'you@example.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:9999',
                description: 'Local dev server',
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
    apis: ['./src/routes/**/*.js'], // Pastikan recursive untuk folder routes
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
