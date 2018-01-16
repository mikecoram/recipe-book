var passport = require('passport');
var async = require('async');
var User = require('../models').User;
var PasswordReset = require('../models').PasswordReset;
var emailHelper = require('../lib/email');
var encryption = require('../lib/encryption');

exports.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// If user is authenticated, redirect them to the user area
exports.redirectToDashboard = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/dashboard');
}

exports.registerRoutes = function (app) {
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        successFlash: 'Welcome to ' + app.locals.AppTitle + '!',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.post('/login', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
    app.post('/forgottenpassword', function (req, res, next) {
        var crypto = require('crypto');

        async.waterfall([
            function (done) {
                crypto.randomBytes(20, function (err, buffer) {
                    var token = buffer.toString('hex');
                    done(err, token);
                });
            },
            function (token, done) {
                User.findOne({
                    where: {
                        emailAddress: req.body.emailAddress
                    }
                }).then(function (user) {
                    if (!user) {
                        req.flash('error', 'No account with that email address exists.');
                        return res.redirect('/forgottenpassword');
                    }

                    // Find any previous reset token
                    PasswordReset.findOne({
                        where: {
                            userId: user.id
                        }
                    }).then(function (passwordReset) {
                        if (passwordReset) {
                            // Delete existing reset token
                            PasswordReset.destroy({
                                where: {
                                    id: passwordReset.id
                                }
                            });
                        }

                        PasswordReset.create({
                            userId: user.id,
                            token: token,
                            expiry: Date.now() + 3600000 // 1 hour
                        }).then(function () {
                            done(null, token, user);
                        });
                    });
                });
            },
            function (token, user, done) {
                var mailOptions = {
                    to: user.emailAddress,
                    subject: app.locals.AppTitle + ' - reset password',
                    template: 'resetpassword',
                    context: {
                        host: req.headers.host,
                        token: token
                    }
                }
                emailHelper.sendMail(mailOptions, function (err) {
                    req.flash('info', 'An email has been sent to ' + user.emailAddress + ' with further instructions.');
                    done(err, 'done');
                });
            }
        ], function(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/forgottenpassword');
        });
    });

    app.post('/resetpassword/:token', function (req, res) {
        PasswordReset.findOne({
            where: {
                token: req.params.token,
                expiry: {
                    $gt: Date.now()
                }
            }
        }).then(function (passwordReset) {
            if (!passwordReset) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('back');
            }

            var validation = require('../lib/validation');
            var newPassword = req.body.password;
            if (!validation.isValidPassword(newPassword)) {
                req.flash('error', 'Please enter a valid password.');
                return res.redirect('back');
            }

            User.findOne({
                where: {
                    id: passwordReset.userId
                }
            }).then(function (user) {
                user.update({
                    password: encryption.generatePasswordHash(newPassword)
                }).then(function () {
                    // Delete token
                    PasswordReset.destroy({
                        where: {
                            id: passwordReset.id
                        }
                    });

                    req.flash('success', 'Your password has been updated.');
                    return res.redirect('back');
                });
            });
        });
    });
}