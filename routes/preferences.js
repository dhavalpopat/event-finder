const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

router.put('/', auth, (req, res) => {
    db.get('users')
    .find({ id: 'dhaval' })
    .assign({ category: req.body.category })
    .assign({ genre: req.body.genre })
    .write();
    res.send('Your preferences have been successfully updated.');
});

module.exports = router;
