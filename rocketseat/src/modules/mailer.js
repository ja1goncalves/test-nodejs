const nodemailer = require('nodemailer');
const configApp = require('../config/app.json');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const transport = nodemailer.createTransport(configApp.transport);

transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resource/mail/'),
    extName: '.html'
}));

module.exports = transport;