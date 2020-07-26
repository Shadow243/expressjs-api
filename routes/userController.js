//Imports
let bcrypt = require('bcrypt');
var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');

// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,24}$/;


//Routes
module.exports = {
    login: function (req, res) {
        // Params
        let email = req.body.email;
        let password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'email & password fields are required' });
        }

        asyncLib.waterfall([
            function (done) {
                //find user firstly
                models.User.findOne({
                    where: { email: email }
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound, done) {
                if (userFound) {
                    //if user then compare hashed password
                    bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {
                        done(null, userFound, resBycrypt);
                    });
                } else {
                    return res.status(404).json({ 'error': 'user not exist in DB' });
                }
            },
            function (userFound, resBycrypt, done) {
                if (resBycrypt) {
                    //if Okay then return user
                    done(userFound);
                } else {
                    return res.status(403).json({ 'error': 'invalid password' });
                }
            }
        ], function (userFound) {
            if (userFound) {
                return res.status(201).json({
                    'user': userFound,
                    'token': jwtUtils.generateTokenForUser(userFound)
                });
            } else {
                return res.status(500).json({ 'error': 'cannot log on user' });
            }
        });
    },
    register: function (req, res) {

        // Params
        let email = req.body.email;
        let name = req.body.name;
        let password = req.body.password;
        var phone = req.body.phone;
        let countryCode = req.body.countryCode;
        let userStatus = req.body.active || false;

        //manual validations
        if (email == null || name == null || password == null) {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        if (phone !== null) {
            if (phone.length >= 10 || phone.length < 9) {
                return res.status(400).json({ 'error': 'wrong phone (must be length 9)' });
            }
        }

        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email is not valid' });
        }

        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
        }

        //process datas
        asyncLib.waterfall([
            function (done) {
                //check if there is an email like our email passed
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                    .then(function (userFound) {
                        done(null, userFound);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            function (userFound, done) {
                //if not exists the use bcrypt to hash our password
                if (!userFound) {
                    bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                        done(null, userFound, bcryptedPassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'user already exist' });
                }
            },
            function (userFound, bcryptedPassword, done) {
                let newUser = models.User.create({
                    email: email,
                    name: name,
                    password: bcryptedPassword,
                    phone: phone,
                    country_code: countryCode,
                    active: userStatus
                })
                    .then(function (newUser) {
                        done(newUser);
                    })
                    .catch(function (err) {
                        return res.status(500).json({ 'error': 'cannot add user' });
                    });
            }
        ], function (newUser) {
            if (newUser) {
                return res.status(201).json({
                    'user': newUser
                });
            } else {
                return res.status(500).json({ 'error': 'cannot add user' });
            }
        });
    }
}
