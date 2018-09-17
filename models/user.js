const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

function validateUser(user) {
    const schema = {
        name: Joi.string().max(64).required(),
        email: Joi.string().min(5).max(256).required().email(),
        password: Joi.string().min(5).max(256).required(),
        category: Joi.string().max(64).required(),
        genre: Joi.string().max(64).required()
    };
    return Joi.validate(user, schema);
}

function generateAuthToken(user) {
    // payload has user's email and isAdmin
    const token = jwt.sign({ email: user.email, isAdmin: user.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

exports.validate = validateUser;
exports.generateAuthToken = generateAuthToken;
