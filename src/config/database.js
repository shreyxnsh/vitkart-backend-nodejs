const mongoose = require('mongoose');
const connection = mongoose.createConnection('mongodb+srv://shreyxnsh:Mongodb125$@cluster0.k2jqyqn.mongodb.net/vitkart', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Increase the server selection timeout to 30 seconds
    socketTimeoutMS: 30000,  // Increase the server selection timeout to 30 seconds
});

connection.on('open', () => {
    console.log('MongoDB Connected');
}).on('error', (err) => {
    console.log('MongoDb connection error:', err);
});

module.exports = connection;
