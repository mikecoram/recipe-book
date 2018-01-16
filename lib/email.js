var nodemailer = require('nodemailer');
var handlebars = require('nodemailer-express-handlebars');

var constants = require('../constants');
 
// Setup email transporter with settings from config/config.json
var tOptions = require('../config/config')[process.env.NODE_ENV || 'development'].email;
var transporter = nodemailer.createTransport(tOptions);

transporter.use('compile', handlebars({
    viewPath: 'views/emails',
    extName: '.hbs'
}));

module.exports.sendMail = function (mailOptions, callback) {
    mailOptions.from = constants.FROM_EMAIL;
    transporter.sendMail(mailOptions, callback || function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}