const express = require('express');
const auth = require('../middleware/auth');
const global = require('../global');

const router = express.Router();

router.delete('/', auth, (req, res) => {
    global.db.remove({ email: req.user.email }, {}, (err, numRemoved) => {
        res.send('Your account has been successfully deleted.');
    });
});

module.exports = router;
