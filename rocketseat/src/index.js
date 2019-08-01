const express = require('express');
const bodyParser = require('body-parser');

//init server by framework express
const app = express();

// bodyParse indication 
app.use(bodyParser.json()); //understand json request
app.use(bodyParser.urlencoded({extended: false})); // decode request

//import every controlls routes through app
require('./app/controllers/index')(app);

app.listen(8000, () => {
    console.log('Server available');
});
