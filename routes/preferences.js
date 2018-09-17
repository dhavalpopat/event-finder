const express = require('express');
const auth = require('../middleware/auth');
const global = require('../global');

const router = express.Router();

router.put('/', auth, (req, res) => {
    if (req.body.category === undefined && req.body.genre === undefined) {
        return res.send('Your preferences have not been changed.');
    }
    global.db.update({ email: req.user.email }, { $set: { category: req.body.category } });
    global.db.update({ email: req.user.email }, { $set: { genre: req.body.genre } });
    res.send('Your preferences have been successfully updated.');
});

module.exports = router;
