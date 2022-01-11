const { db } = require('../../Database/connection');
const Joi = require('joi');
const tableName = 'customers';

const bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = 'Bheegi Bheegi Raton Mein'

const hashGenerator = function (plainText) {
    bcrypt.hash(plainText, saltRoundS)
        .then(hash => {
            return hash;
        })
}
exports.plugin = {
    pkg: require('../../package.json'),

    register: function (server, options) {
        server.route({
            method: 'GET',
            path: '/allUsers',
            handler: async (request, h) => {
                const data = await db().collection(tableName).find({}).toArray();
                return { ...data };
            }
        })
        server.route({
            method: 'POST',
            path: '/register',
            options: {
                validate: {
                    payload: Joi.object({
                        name: Joi.string().min(3).max(50).required(),
                        email: Joi.string().min(10).max(100).required(),
                        password: Joi.string().min(8).max(100).required(),
                        DOB: Joi.string().isoDate().required(),
                        mobile: Joi.number().max(20).min(6)
                    })
                }
            },
            handler: async (request, h) => {
                const payload = request.payload;
                // const hashedPassword = hashGenerator(payload.password);
                // payload.password = hashedPassword;
                console.log(payload);
                // Generate Bcrypt hash 
                // insert into payload
                const ack = await db().collection(tableName).insertOne(payload);
                return { payload, ack, msg: 'POST Register ' }
            }
        })
        server.route({
            method: 'POST',
            path: '/login',
            handler: async (request, h) => {
            }
        })
        server.route({
            method: 'POST',
            path: '/logout',
            handler: async (request, h) => {
                return 'POST /logout '
            }
        })
        server.route({
            method: 'PATCH',
            path: '/update',
            handler: async (request, h) => {
                return 'PATCH /update'
            }
        })
        server.route({
            method: 'DELETE',
            path: '/remove',
            handler: async (request, h) => {
                return 'DELETE /remove'
            }
        })
    }
}
