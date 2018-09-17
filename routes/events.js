const express = require('express');
const https = require('https');
const config = require('config');
const auth = require('../middleware/auth');
const global = require('../global');

const router = express.Router();

router.get('/', auth, (req, res) => {
    global.db.findOne({ email: req.user.email }, async (err, user) => {
        if (user === null) {
            // user not found in the database
            return res.status(400).send('Session expired. Please login to continue.');
        }
        else {
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
        }
    });
});

module.exports = router;
