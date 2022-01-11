const entity = '/user'
const { db } = require('../../Database/connection');
const Joi = require('joi');
const tableName = 'customers';


const bcrypt = require('bcrypt');
const salt = 'Bheegi Bheegi Raton Mein'

const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(8).max(100).required(),
    DOB: Joi.string().isoDate().required(),
    mobile: Joi.number().max(20).min(6)
})

const hashGenerator = function (plainText, saltRounds = 10) {
    console.log(saltRounds)
    bcrypt.hash(plainText, saltRounds)
        .then(hash => {
            return hash;
        })
}

module.exports = [
    {
        method: 'GET',
        path: entity + '/allUsers',
        handler: async (request, h) => {
            const data = await db().collection(tableName).find({}).toArray();
            return { ...data };
        }
    },
    {
        method: 'POST',
        path: entity + '/register',
        options: {
            validate: {
                payload: userSchema,
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
    },
    {
        method: 'POST',
        path: entity + '/login',
        handler: async (request, h) => {
        }
    },
    {
        method: 'POST',
        path: entity + '/logout',
        handler: async (request, h) => {
            return 'POST /logout '
        }
    },
    {
        method: 'PATCH',
        path: entity + '/update',
        handler: async (request, h) => {
            return 'PATCH /update'
        }
    },
    {
        method: 'DELETE',
        path: entity + '/remove',
        handler: async (request, h) => {
            return 'DELETE /remove'
        }
    },

]