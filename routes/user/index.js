const entity = '/user'
const { db } = require('../../Database/connection');
const Joi = require('joi');
const tableName = 'customers';
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(8).max(100).required(),
    DOB: Joi.string().isoDate().required(),
    mobile: Joi.number().max(20).min(6)
})

const hashGenerator = async function (plainText, saltRounds = 10) {
    let hash = await bcrypt.hash(plainText, saltRounds)
    return hash;
}

module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: () => {
            return 'Go to another route';
        }
    },
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
            },
            tags: ['api']
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
    {
        method: 'POST',
        path: entity + '/login',
        handler: async (request, h) => {
            const { email, password } = request.payload;

            const user = await db().collection(tableName).findOne({ email: email });

            const isValid = await bcrypt.compare(password, user.password);

            return { email, password, isValid };
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
        path: entity + '/remove/{userId}',
        // options: {
        //     validate: {
        //         params: Joi.object()
        //     }
        // },
        handler: async (request, h) => {
            const userId = request.params.userId;
            const ack = await db().collection(tableName).deleteOne({ _id: ObjectId(userId) });
            return ack;
        }
    },
    {
        method: 'DELETE',
        path: entity + '/removeAll',
        handler: async (request, h) => {
            const ack = await db().collection(tableName).deleteMany({});
            return ack;
        }
    },

]