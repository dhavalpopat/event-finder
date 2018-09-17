const userModel = require('../models/user');
const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const store = require('store');
const global = require('../global');

const router = express.Router();

router.post('/', (req, res) => {
    // validate the request
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    global.db.findOne({ email: req.body.email }, async (err, user) => {
        if (user === null) {
            // user not found in the database
            return res.status(400).send('Invalid email or password.');
        }
        else {
            // decrypt and verify the password
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if(!validPassword) return res.status(400).send('Invalid email or password.');

            // generate the authentication token and send the response
            const token = userModel.generateAuthToken(user);
            store.clearAll();
            store.set('x-auth-token', token);  // save token in local storage at client side
            res.header('x-auth-token', token).send('Welcome, ' + user.name + '!');
        }
    });
});

function validate(req) {
    const schema = {
        email: Joi.string().required(),
        password: Joi.string().required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;
