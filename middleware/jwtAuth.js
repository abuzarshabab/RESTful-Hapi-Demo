'use strict';
const { db } = require('../Database/connection');
const hapiAuthJwt2 = require('hapi-auth-jwt2');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || `it's secret`;
const logger = require('./logger');
const tableName = 'customers'

module.exports = {
    name: 'jwtAuth',
    version: '1.0.0',
    register: async (server, options, next) => {
        await server.register(hapiAuthJwt2);

        server.auth.strategy('jwt', 'jwt', {
            key: JWT_SECRET_KEY,
            validate: validate,
            verifyOptions: { algorithms: ['HS256'] }
        });

        async function validate(decoded, req) {
            // console.log(decoded);
            if (!decoded) return 'invalid token or null'

            try {
                const user = await db().collection(tableName).findOne({ email: decoded })
                if (user.email === decoded) {
                    req.token = decoded;
                    return { isValid: true }
                }

                return { isValid: false }
            } catch (err) {
                console.log(err);
                return { isValid: false, errorMessage: 'Something wrong try again later' };

            }
        }
        server.auth.default('jwt');
    }
}
