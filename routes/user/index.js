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
    email: Joi.string().min(10).max(100).email().required(),
    password: Joi.string().min(8).max(100).required(),
    DOB: Joi.string().isoDate().required(),
    mobile: Joi.number().max(20).min(6)
})
const userUpdateSchema = Joi.object({
    email: Joi.string().min(10).max(100).required(),
    name: Joi.string().min(5).max(50),
    password: Joi.string().min(8).max(100),
    DOB: Joi.string().isoDate(),
    mobile: Joi.number().max(20).min(6),
})
const userLoginSchema = Joi.object({
    email: Joi.string().min(10).max(100).email().required(),
    password: Joi.string().min(8).max(100).required(),
})
const emailSchema = Joi.object({
    email: Joi.string().email().required()
});
const jwtSchema = Joi.object({
    token: Joi.string().required(),
})
const updateEmailSchema = Joi.object({
    currentEmail: Joi.string().min(10).max(100).email().required(),
    newEmail: Joi.string().min(10).max(100).email().required(),
    confirmEmail: Joi.string().min(10).max(100).email().required(),
})

hashGenerator = async function (plainText, saltRounds = 10) {
    return bcrypt.hash(plainText, saltRounds)
}

module.exports = [
    {
        method: 'GET',
        path: entity + '/byToken',
        options: {
            description: 'Get user details by token',
            notes: 'Returns user information excluding password',
            tags: ['api'], // ADD THIS TAG
        },

        handler: async (request, h) => {
            const userId = request.auth.credentials;
            const omitProjection = { projection: { password: 0, _id: 0 } };
            const query = { email: userId }

            const user = await db().collection(tableName).findOne(query, omitProjection);
            return user;
        }
    },
    {
        method: 'POST',
        path: entity + '/byEmail',
        options: {
            validate: {
                payload: emailSchema,
            },
            auth: false,
            description: 'User detail ',
            notes: 'Returns user information excluding password',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {

            const { email } = request.payload;

            if (!email) return h.response({ message: 'Email is required' }).code(400); // return if email doesn't exist

            const user = await db().collection(tableName).findOne({ email: email }, { projection: { name: 1, email: 1, mobile: 1, DOB: 1 } });

            if (!user) return { message: 'User not found' }; // return if user doesn't exist

            return { user };

        }
    },
    {
        method: 'GET',
        path: entity + '/all',
        options: {
            auth: false,
            description: 'Get All Users',
            notes: 'All users that are currently available in Database',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {
            const data = await db().collection(tableName).find({}).toArray();
            return { ...data };
        }
    },
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
            if (existingUser) return h.response({ message: 'User already exist' }).code(400);

            payload.password = await hashGenerator(payload.password, 10);

            const ack = await db().collection(tableName).insertOne(payload);

            return { msg: 'User registration success' }
        }
    },
    {
        method: 'POST',
        path: entity + '/login',
        options: {
            validate: {
                payload: userLoginSchema,
            },
            auth: false,
            description: 'Login user',
            notes: 'Returns jwt for authorization with valid status',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {

            const { email, password } = request.payload;

            const user = await db().collection(tableName).findOne({ email: email });

            const isValidUser = user && await bcrypt.compare(password, user.password);

            if (!isValidUser) return { error: 'Invalid Credentials' };

            const token = jwt.sign(email, JWT_SECRET_KEY,)

            return { token, isValidUser };
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
    {
        method: 'PATCH',
        path: entity + '/update',
        options: {
            validate: {
                payload: userUpdateSchema
            },
            description: 'Update user details',
            notes: 'Return updates with update status',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {
            // get request payload
            const userId = request.auth.credentials;

            const { email, ...update } = request.payload;

            if (email !== userId) return { errorMsg: 'Try again after re-login' }
            if (update.password) update.password = await hashGenerator(update.password, 10);

            const updateResult = await db().collection(tableName).findOneAndUpdate({ email: userId }, { $set: update });

            return { isUpdated: updateResult.ok ? true : false, msg: updateResult.ok ? 'User updated successfully' : 'User not updated' }
        }
    },

    {
        method: 'PATCH',
        path: entity + '/updateEmail',
        options: {
            validate: {
                payload: updateEmailSchema,
            },
            description: 'Update user email ',
            notes: 'Return update status with updated email',
            tags: ['api'], // ADD THIS TAG
        },
        handler: async (request, h) => {

            const userId = request.auth.credentials;
            const { currentEmail, newEmail, confirmEmail } = request.payload

            if (currentEmail !== userId) return { errorMsg: 'Login credential does not match to your current email and login credential' }
            if (newEmail !== confirmEmail) return { errorMsg: 'Confirm email does not match' }

            const updateResult = await db().collection(tableName).findOneAndUpdate({ email: userId }, { $set: { email: newEmail } });

            if (!updateResult.ok) return { errorMsg: 'UpdateFailed : some internal error' }

            return {
                // isUpdated: updateResult.ok ? true : false,
                msg: updateResult.ok ? 'User updated successfully' : 'User not updated',
                oldEmail: updateResult.value.email,
                newEmail,
            }
        }
    },
    {
        method: 'DELETE',
        path: entity + '/remove/{userId}',
        options: {
            validate: {
                params: Joi.object({
                    userId: Joi.string().email().required(),
                })
            },
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
            const userId = request.auth.credentials;
            const ack = await db().collection(tableName).deleteOne({});
            return ack;
        }
    },

]