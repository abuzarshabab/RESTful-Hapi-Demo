'use strict';
const hapiAuthJwt2 = require('hapi-auth-jwt2');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || `it's secret`;
const validatorModule = require('./jwtAuthValidator');

module.exports = {
    name: 'jwtAuth',
    version: '1.0.0',
    register: async (server, options, next) => {
        await server.register(hapiAuthJwt2);

        server.auth.strategy('jwt', 'jwt', {
            key: JWT_SECRET_KEY,
            validate: validatorModule,
            verifyOptions: { algorithms: ['HS256'] }
        });

        server.auth.default('jwt');
    }
}
