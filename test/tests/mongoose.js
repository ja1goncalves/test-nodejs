const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/study_mongo', {
    useNewUrlParser: true
}).then(() => {
    console.log('Connection succefull')
}).catch((err) => {
    console.log('Connection failed: ' + err)
})

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: false
    }
})

const User = mongoose.model('users', UserSchema)

var user = new User({
    name: "jbisubds",
    email: "fbcsdjfnçs",
    password: 'nfcksjdblskajd',
    age: 46
}).save().then((user) => {
    console.log("usuario criado")
}).catch((err) => {
    console.log('ERRO: ' + err)
})