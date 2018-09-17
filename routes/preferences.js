const express = require('express');
const auth = require('../middleware/auth');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // FileSync is a lowdb adapter for saving to local storage

const adapter = new FileSync('db.json');
const db = low(adapter);  // create database instance

const router = express.Router();

router.put('/', auth, (req, res) => {
    db.get('users')
    .find({ email: req.user.email })
    .assign({ category: req.body.category })
    .assign({ genre: req.body.genre })
    .write();
    res.send('Your preferences have been successfully updated.');
});

module.exports = router;
