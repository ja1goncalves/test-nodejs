const mongoose = require('mongoose');

//connection with db
mongoose.connect('mongodb://localhost/rocketseat', {
    useMongoClient: true, //way connection with database
});

//class Promisse indication 
mongoose.Promise = global.Promise;

module.exports = mongoose;
