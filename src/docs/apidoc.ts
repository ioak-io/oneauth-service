import { createUser, createUserBody } from "./users";

const apiDocumentation = {
    openapi: '3.0.1',
    info: {
        version: '1.3.0',
        title: 'Authlite API documentation',
        description: 'API user guide',
        termsOfService: 'https://mysite.com/terms',
        contact: {
            name: 'Arun Kumar Selvaraj',
            email: 'arun@ioak.io',
            url: 'https://ioak.io',
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    servers: [
        {
            url: 'http://localhost:4010/',
            description: 'Local Server',
        },
        {
            url: 'https://api.ioak.io:8010/',
            description: 'Production Server',
        },
    ],
    tags: [
        {
            name: 'User',
        },
        {
            name: 'Role',
        }
    ],
    paths: {
        users: {
            post: createUser,
        },
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            createUserBody,
        },
    },
};

export { apiDocumentation };