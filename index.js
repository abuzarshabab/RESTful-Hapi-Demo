const { connect, close } = require('./Database/connection');
const Hapi = require('@hapi/hapi');
const swagger = require('./middleware/swagger');
const logger = require('./middleware/logger');
const jwtAuth = require('./middleware/jwtAuth');
const routes = require('./routes');

const init = async () => {
    const server = new Hapi.Server({
        port: process.env.SERVER_PORT,
        host: process.env.SERVER_HOST,
    });

    try {
        await server.register(swagger);
        await server.register(jwtAuth)
        await server.route(routes);
        await server.start();
        await connect();
        await logger.info("Server started : " + process.env.SERVER_HOST + process.env.SERVER_PORT);

        // await setTimeout(close, 3000);
    } catch (err) {
        console.log("Server starting failed" + err);
        process.exit(0);
    }

}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(0);
})

init();
