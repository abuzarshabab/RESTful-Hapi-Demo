const logger = require('winston');

const mongodb = require('mongodb');
const { MongoClient } = mongodb;
const uriAtlas = 'mongodb+srv://<username>:<password>@cluster0.vjuat.mongodb.net/Hapi-demo?retryWrites=true&w=majority';
const uriLocal = 'mongodb://localhost:27017';
let state = { db: null };

// exports.connect = async () => {

//     if (state.db === null) return callback();

//     const Client = new MongoClient(uriLocal);
//     try {
//         const con = await Client.connect();
//         state.db = con.db();
//         console.log('---------- Connection Succeeded ---------')
//     } catch (err) {
//         console.log('Error while connection ' + err)
//         // use logger for log 
//     }
// }

exports.connect = () => {
    // if (state.db === null) return callback();
    const Client = new MongoClient(uriLocal);

    Client.connect()
        .then(connection => {
            const msg = `Mongo db connection established to ${uriLocal} `
            console.log(msg) //
            state.db = connection.db();
        })
        .catch(err => {
            console.log(`Error DB Connection : ${err}`); // Use Logger Here
            process.exit(0);
        })
}

// exports.connect = () => {
//     const Client = new MongoClient(uriLocal);

//     Client.connect((error, connection) => {
//         if (error) {
//             console.log(`mongoDB connection failed : ${error}`);
//             logger.info(`MongoDB connection successfully established to ${uriLocal}`);
//             process.exit(0);
//         }
//         state.db = connection.db(); // Use logger 
//         console.log(`mongoDB connection established to ${uriLocal} `)
//     })
// }

exports.db = () => state.db;

// exports.close = () => {
//     if (state.db) {
//         state.db.close();
//         return 'Connection terminated successfully';
//     } else {
//         return 'Failed "connection does not exist"'
//     }
// }