const Hapi = require('@hapi/hapi');
const db = require('./Database/connection');
const inert = require('@hapi/inert');
const vision = require('@hapi/vision');
const hapiSwagger = require('hapi-swagger');
const swaggerOptions = {
    info: {
        title: "RESTful-Hapi-Demo  Documentation",
        version: 2.2,
    }
}
const init = async () => {
    const server = new Hapi.Server({
        port: 3000,
        host: 'localhost',
    });

    try {
        await server.register([inert, vision, { plugin: hapiSwagger, options: swaggerOptions }])
        await server.route(require('./routes'));
        await server.start();
        await db.connect();
        console.log('Server is running on port 3000');
    } catch (err) {
        console.log('Server start Error', err);
        process.exit(0);
    }

}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(0);
})


init();
