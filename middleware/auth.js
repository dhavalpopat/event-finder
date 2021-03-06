/*
This middleware function is for authorizing users
*/

const jwt = require('jsonwebtoken');
const config = require('config');
const store = require('store');

module.exports = function (req, res, next) {
    const token = store.get('x-auth-token');  // get authentication token from request header
    if (!token) return res.status(401).send('Please log in to continue.');  // access denied: token is not provided

    try {
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decodedPayload;
        next();  // pass control to the next middleware function in the request processing pipeline (i.e. route handler, in this case)
    }
    catch (ex) {
        res.status(400).send('Access denied: Token is invalid.')
    }
}
