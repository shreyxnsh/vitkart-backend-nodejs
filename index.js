// starting point of nodejs

// to get everything which is mentioned in the app folder.
const app = require('./app');
const http = require('http').createServer(app).listen(8000);
const db = require('./config/database');
const userModel = require('./model/user.model');


//create a port for the server
const port = 3001;

// get request for route
app.get('/', (req, res)=>{
    res.send("flutter-nodejs-project");
});

app.listen(port, ()=>{
    console.log('Server Listening on port http://localhost:' + port);

});