const Joi = require('joi');

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

exports.validate = validateUser;