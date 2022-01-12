const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const swaggerOptions = {
    info: {
        title: 'Test API Documentation',
        version: '0.0.1',
    },
};

module.exports = ([
    Inert,
    Vision,
    {
        plugin: HapiSwagger,
        options: swaggerOptions
    }
])


