const express = require('express');
const https = require('https');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, (req, res) => {

    const user = db.get('users')
    .find({ email: req.user.email })
    .value();

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
            res.send('Nearby Events: ' + result);
        });
    }).on('error', (err) => {
        console.log('Error: ' + err.message);
    });
});

module.exports = router;
