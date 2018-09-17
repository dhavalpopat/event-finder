const userModel = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const store = require('store');
const global = require('../global');

const router = express.Router();

router.post('/', (req, res) => {
    // validate the request
    const { error } = userModel.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    global.db.findOne({ email: req.body.email }, async (err, user) => {
        if (user === null || user === '') {
            // user not found in the database
            // encrypt the password
            const salt = await bcrypt.genSalt(10);
            const password = await bcrypt.hash(req.body.password, salt);

            // add a new user to the database
            const newUser = {
                name: req.body.name,
                email: req.body.email,
                password: password,
                category: req.body.category,
                genre: req.body.genre
            }
            global.db.insert(newUser, (err, newAddedUser) => {
                // login the user when they register
                const token = userModel.generateAuthToken(newUser);  // generate the authentication token
                store.set('x-auth-token', token);  // save token in local storage at client side
                res.header('x-auth-token', token).send('You have been successfully registered.');
            });
        }
        else {
            // user already exists in the database
            return res.status(400).send(req.body.email + ' is already registered');
        }
    });

    
});

module.exports = router;
