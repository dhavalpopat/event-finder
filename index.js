const helmet = require('helmet');
const https = require('https');
const express = require('express');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // FileSync is a lowdb adapter for saving to local storage
const register = require('./routes/register')

const app = express();
app.use(express.json());
app.use(helmet());

const adapter = new FileSync('db.json');
const db = low(adapter);  // create database instance

// handling routes
app.use('/register', register);    // api endpoint for user registeration

let category = "Music";
let genreId = "KnvZfZ7vAee";
const user = "stitapplicant";
const password = "zvaaDsZHLNLFdUVZ_3cQKns";

var options = {
    host: "yv1x0ke9cl.execute-api.us-east-1.amazonaws.com",
    path: "/prod/events?classificationName=" + category + "&genreId=" + genreId,
    auth: user + ":" + password
};

// set default state
db.defaults({ users: [] })
  .write();

// api endpoint for home page
app.get('/', (req, res) => {
    res.send('Welcome');
});

// api endpoint to reset user database
app.delete('/reset', (req, res) => {
    db.set('users', [])
    .write();
res.send('The database has been successfully truncated.');
});

// api endpoint for user login

// api endpoint for getting nearby events
app.get('/getEvents', (req, res) => {
    https.get(options, (https_res) => {
        let data = '';
        let result = '';

        // chunk of data has been received
        https_res.on('data', (chunk) => {
            data += chunk;
        });
        
        // whole response has been received
        https_res.on('end', () => {
            let dataJSON = JSON.parse(data);
            for (let i = 0; i < dataJSON.length; i++) {
                if (dataJSON[i].name != null){
                    result += dataJSON[i].name + '\n';
                }
            }
            res.send('Nearby Events: ' + result);
        });
    }).on('error', (err) => {
        console.log('Error: ' + err.message);
    });
});

// api endpoint to update user's preferences
app.put('/setPreferences', (req, res) => {
    console.log(req.body)
    db.get('users')
    .find({ id: 'dhaval' })
    .assign({ category: req.body.category })
    .assign({ genre: req.body.genre })
    .write();
    res.send('Your preferences have been successfully updated.');
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
