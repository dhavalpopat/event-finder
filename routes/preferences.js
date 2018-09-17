const express = require('express');
const auth = require('../middleware/auth');
const global = require('../global');

const router = express.Router();

router.put('/', auth, (req, res) => {
    global.db.update({ email: req.user.email }, { $set: { category: req.body.category } });
    global.db.update({ email: req.user.email }, { $set: { genre: req.body.genre } });
    res.send('Your preferences have been successfully updated.');
});

module.exports = router;
