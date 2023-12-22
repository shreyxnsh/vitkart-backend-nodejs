// starting point of nodejs

// to get everything which is mentioned in the app folder.
const app = require('./app');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
//create a port for the server
const port = 3001;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.log(err);
  });

// get request for route
app.get('/', (req, res)=>{
    res.send("VITKART - Ecommerce for VIT Bhopal");
});

app.listen(port, ()=>{
    console.log('Server Listening on port http://localhost:' + port);

});