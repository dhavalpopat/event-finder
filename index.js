const express = require('express');
const app = express();
app.use(express.json());

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // FileSync is a lowdb adapter for saving to localStorage
const adapter = new FileSync('db.json');
const db = low(adapter);  // create database instance

const https = require('https');

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
    https.get(options, (https_res) => {
        let data = "";
        let result = "";

        // chunk of data has been received
        https_res.on('data', (chunk) => {
            data += chunk;
        });
        
        // whole response has been received
        https_res.on('end', () => {
            let dataJSON = JSON.parse(data);
            for (let i = 0; i < dataJSON.length; i++) {
                if (dataJSON[i].name != null){
                    result += dataJSON[i].name + "\n";
                }
            }
            res.send("Nearby Events: " + result);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
