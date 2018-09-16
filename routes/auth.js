const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // FileSync is a lowdb adapter for saving to local storage

const router = express.Router();
const adapter = new FileSync('db.json');
const db = low(adapter);  // create database instance

// set default state
db.defaults({ users: [] })
  .write();

router.post('/', async (req, res) => {
    // validate the request
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if user already exists
    const user = db.get('users')
    .find({ email: req.body.email })
    .value();
    if (typeof user === 'undefined') return res.status(400).send('Invalid email or password.');

    // decrypt and verify the password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password.');

    // 
    const token = jwt.sign({ email: user.email }, 'privateKey');
    res.send('You have been successfully authenticated.');
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(256).required().email(),
        password: Joi.string().min(5).max(256).required(),
    };
    return Joi.validate(req, schema);
}

module.exports = router;
