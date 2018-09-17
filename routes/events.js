const express = require('express');
const https = require('https');
const config = require('config');
const auth = require('../middleware/auth');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');  // FileSync is a lowdb adapter for saving to local storage

const adapter = new FileSync('db.json');
const db = low(adapter);  // create database instance

const router = express.Router();

router.get('/', auth, (req, res) => {

    const user = db.get('users')
    .find({ email: req.user.email })
    .value();

    // console.log('user: ' + JSON.stringify(user));

    const category = user.category;
    const genreId = user.genre;
    const apiExternalUser = config.get('apiExternalUser');
    const apiExternalPassword = config.get('apiExternalPassword');

    let options = {
        host: "yv1x0ke9cl.execute-api.us-east-1.amazonaws.com",
        path: "/prod/events?classificationName=" + category + "&genreId=" + genreId,
        auth: apiExternalUser + ":" + apiExternalPassword
    };

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
            if (result === '') res.send('There are no events nearby you that match your preferences.')
            else res.send('Following are the nearby events that match your preferences: \n' + result);
        });
    }).on('error', (err) => {
        console.log('Error: ' + err.message);
    });
});

module.exports = router;
