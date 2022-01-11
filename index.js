const Hapi = require('@hapi/hapi');
const inert = require('@hapi/inert');
const vision = require('@hapi/inert');
const swagger = require('hapi-swagger');
const db = require('./Database/connection')

const init = async () => {
    const server = new Hapi.Server({
        port: 3000,
        host: 'localhost',
    });
    server.route({
        method: 'GET',
        path: '/',
        handler: () => {
            return 'Go to another route';
        }
    });

    try {
        await server.route(require('./routes'));
        await server.start();
        db.connect();
    } catch (err) {
        console.log('Server start Error', err);
        process.exit(0);
    }
    console.log('Server is running on port 3000');
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(0);
})


init();
