const express = require('express');
const app = express();
app.use(express.json());

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // FileSync is a lowdb adapter for saving to localStorage
const adapter = new FileSync('db.json');
const db = low(adapter);  // create database instance

const request = require('request');

let category = 'Music';
let genreId = "KnvZfZ7vAee";
const endpointURL = "https://yv1x0ke9cl.execute-api.us-east-1.amazonaws.com/prod/events?classificationName=" + category + "&genreId=" + genreId;
let url = "http://stitapplicant:zvaaDsZHLNLFdUVZ_3cQKns@" + endpointURL;

// set default state
db.defaults({ users: [] })
  .write()

// api endpoint for home page
app.get('/', (req, res) => {
    res.send('Welcome');
});

// api endpoint to reset user database
app.delete('/reset', (req, res) => {
    db.set('users', [])
    .write()
});

// api endpoint for user registeration
app.post('/register', (req, res) => {
    const user = {
        id: req.body.id,
        password: req.body.password,
        category: req.body.category,
        genre: req.body.genre
    }
    db.get('users')
    .push(user)
    .write()
    res.send('You have been successfully registered.');
});

// api endpoint for user login

// api endpoint for getting nearby events
app.get('/getEvents', (req, res) => {
    request(
        { url : url },
        function (error, response, body) {
            res.send(error);
        }
    );
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
