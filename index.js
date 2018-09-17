const helmet = require('helmet');
const express = require('express');
const config = require('config');
const register = require('./routes/register');
const auth = require('./routes/auth');
const events = require('./routes/events');
const preferences = require('./routes/preferences');
const global = require('./global');

const app = express();
app.use(express.json());
app.use(helmet());

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

if (!config.get('apiExternalUser')) {
    console.error('FATAL ERROR: apiExternalUser is not defined.');
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
app.use('/delete', delete);                 // api endpoint to delete user's account

// api endpoint for home page
app.get('/', (req, res) => {
    res.send('Welcome');
});

// api endpoint to get all the users
app.get('/users', (req, res) => {
    global.db.find({}, (err, users) => {
        res.send(users);
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
