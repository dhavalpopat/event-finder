const userModel = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
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
    const { error } = userModel.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if user already exists
    const user = db.get('users')
    .find({ email: req.body.email })
    .value();
    if (typeof user !== 'undefined') return res.status(400).send(req.body.email + ' is already registered');

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
    db.get('users')
    .push(newUser)
    .write();
    res.send('You have been successfully registered.');
});

module.exports = router;
