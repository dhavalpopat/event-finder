const helmet = require('helmet');
const express = require('express');
const config = require('config');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // FileSync is a lowdb adapter for saving to local storage

const register = require('./routes/register');
const auth = require('./routes/auth');
const events = require('./routes/events');
const preferences = require('./routes/preferences');

const adapter = new FileSync('db.json');
const db = low(adapter);  // create database instance

const app = express();
app.use(express.json());
app.use(helmet());

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

if (!config.get('apiExternalPassword')) {
    console.error('FATAL ERROR: apiExternalPassword is not defined.');
    process.exit(1);
}

// handling routes
app.use('/register', register);             // api endpoint for user registeration
app.use('/login', auth);                    // api endpoint for authenticating users
app.use('/getEvents', events);              // api endpoint for getting nearby events
app.use('/setPreferences', preferences);    // api endpoint to update user's preferences

// set default state
db.defaults({ users: [] })
  .write();

// api endpoint for home page
app.get('/', (req, res) => {
    res.send('Welcome');
});

// api endpoint to reset user database
app.delete('/delete', (req, res) => {
    db.get('users')
    .remove({ email: req.body.email })
    .write()
res.send('The user with email ' + req.body.email + ' has been successfully deleted.');
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
