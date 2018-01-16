var passport = require('passport');
var Constants = require('../constants');
var User = require('../models').User;
var LocalStrategy = require('passport-local').Strategy;
var encryption = require('./encryption');

module.exports = function () {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'emailAddress',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, emailAddress, password, done) {
        // Validation
        var validation = require('../lib/validation');
        if (!validation.isValidEmailAddress(emailAddress)) {
            return done(null, false);
        }
        if (!validation.isValidPassword(password)) {
            return done(null, false);
        }

        User.findOne({
            where: {
                emailAddress: emailAddress
            }
        }).then(function (user) {
            if (user) {
                return done(null, false, {
                    message: 'That email address is already in use.'
                });
            }
            else {
                var hashedPassword = encryption.generatePasswordHash(password);
                var data = {
                    emailAddress: emailAddress,
                    password: hashedPassword,
                    status: Constants.USER_STATUS.ACTIVE,
                    role: Constants.USER_ROLE.USER
                };

                User.create(data).then(function (newUser, created) {
                    if (!newUser) {
                        return done(null, false);
                    }
                    if (newUser) {
                        return done(null, newUser);
                    }
                });
            }
        });
    }));

    passport.use('local-signin', new LocalStrategy({
        usernameField: 'emailAddress',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, emailAddress, password, done) {
        User.findOne({
            where: {
                emailAddress: emailAddress
            }
        }).then(function(user) {
            if (!user) {
                return done(null, false, {
                    message: 'Email address does not exist.'
                });
            }
            if (!encryption.passwordMatchesHash(password, user.password)) {
                return done(null, false, {
                    message: 'Incorrect password.'
                });
            }

            return done(null, user.get());
        }).catch(function (err) {
            console.log('Error:', err);
            return done(null, false, {
                message: 'Something went wrong during login, please try again later.'
            });
        });
    }));
}