const mongoose = require('mongoose');
const connection = mongoose.createConnection('mongodb://127.0.0.1:27017/vitkart-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase the server selection timeout to 30 seconds
    socketTimeoutMS: 30000,  // Increase the server selection timeout to 30 seconds
});

connection.on('open', () => {
    console.log('MongoDB Connected');
}).on('error', (err) => {
    console.log('MongoDb connection error:', err);
});

module.exports = connection;
