const Joi = require('joi');
const bcrypt = require('bcrypt');
const tableName = 'customers';
const entity = '/user';
const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || `it's secret`;

const { ObjectId } = require('mongodb');
const { db } = require('../../Database/connection');

const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(8).max(100).required(),
    DOB: Joi.string().isoDate().required(),
    mobile: Joi.number().max(20).min(6)
})
const jwtSchema = Joi.object({

})

const hashGenerator = async function (plainText, saltRounds = 10) {
    return bcrypt.hash(plainText, saltRounds)
}

module.exports = [
    // Done 
    {
        method: 'GET',
        path: entity + '/',
        options: {
            // validation: {
            //     headers: jwtSchema,
            // },
            description: 'User detail ',
            notes: 'Returns user information excluding password',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {
            const email = request.auth.credentials;
            const token = request.auth.token;

            const user = await db().collection(tableName).findOne({ email });
            const response = h.response({ user })
            response.header("Authorization", token)

            return response;
        }
    },
    // Done
    {
        method: 'GET',
        path: entity + '/allUsers',
        options: {
            description: 'Get All Users',
            notes: 'All users that are currently available in Database',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {
            const data = await db().collection(tableName).find({}).toArray();
            return { ...data };
        }
    },
    // done
    {
        method: 'POST',
        path: entity + '/register',
        options: {
            auth: false,
            validate: {
                payload: userSchema,
            },
            description: 'Register user',
            notes: 'Returns registration Ack or User already exist',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {

            const payload = request.payload;
            const existingUser = await db().collection(tableName).findOne({ email: payload.email })

            // Guard Clause
            if (existingUser) {
                return { error: 'User already exists ', existingUser, email: payload.email }
            }
            payload.password = await hashGenerator(payload.password, 10);
            const ack = await db().collection(tableName).insertOne(payload);
            return { msg: 'User registration success' }
        }
    },

    // Login user done
    {
        method: 'POST',
        path: entity + '/login',
        options: {
            auth: false,
            description: 'Login user',
            notes: 'Returns jwt for authorization with valid status',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {

            const { email, password } = request.payload;

            const user = await db().collection(tableName).findOne({ email: email });

            const isValidUser = user && await bcrypt.compare(password, user.password);

            if (isValidUser) {
                const token = jwt.sign(email, JWT_SECRET_KEY,)
                console.log();
                return { token, isValidUser };
            }
            return { isValidUser, msg: 'incorrect email or password' }
        }
    },
    {
        method: 'POST',
        path: entity + '/logout',
        options: {
            description: 'Logout user by dismantle JWT',
            notes: 'Returns dismantle status',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {
            return 'POST /logout'
        }
    },
    // Need to be fixed
    {
        method: 'PATCH',
        path: entity + '/update',
        options: {
            auth: 'jwt',
            description: 'Update user details',
            notes: 'Return updates with update status',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {
            return 'PATCH /update'
        }
    },
    {
        method: 'DELETE',
        path: entity + '/remove/{userId}',
        options: {
            validate: { params: Joi.object() },
            description: 'Remove respective user using id and password',
            notes: 'Returns user removal status',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {
            const userId = request.params.userId;
            const ack = await db().collection(tableName).deleteOne({ email: userId });
            return ack;
        }
    },
    {
        method: 'DELETE',
        path: entity + '/removeAll',
        options: {
            description: 'Remove all users from Database',
            notes: 'Returns removed users count Be Aware!',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {
            const ack = await db().collection(tableName).deleteMany({});
            return ack;
        }
    },

]