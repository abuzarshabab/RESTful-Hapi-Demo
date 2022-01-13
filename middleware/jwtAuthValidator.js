
const { db } = require('../Database/connection');
const tableName = 'customers'
const logger = require('./logger');

module.exports = async (decoded, req) => {
    if (!decoded) return 'invalid token or null'
    try {
        const user = await db().collection(tableName).findOne({ email: decoded })
        // Guard clause 
        if (!user) return { isValid: false, errorMsg: 'User not found' }
        if (user.email !== decoded) return { isValid: false, errorMsg: 'login again' }
        req.token = decoded;
        return { isValid: true }
    } catch (err) {
        console.log(err);
        return { isValid: false, errorMsg: 'Something wrong try again later' };
    }
}