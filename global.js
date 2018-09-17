const Datastore = require('nedb');

const db = new Datastore({ filename: 'users.db', autoload: true });
db.ensureIndex({ fieldName: 'email', unique: true });

var Global = {
    db : db
};

module.exports = Global;