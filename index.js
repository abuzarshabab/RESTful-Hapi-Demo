const Hapi = require('@hapi/hapi');
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
            console.log('Index hit success');
            return 'Go to another route';
        }
    });

    await server.register({
        plugin: require('./routes/crud'),
        routes: {
            prefix: '/crud'
        }
    });

    await server.start();
    console.log('Server is running on port 3000');
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(0);
})

db.connect();
init();
