const https = require('https');

const router = express.Router();

let category = 'Music';
let genreId = 'KnvZfZ7vAee';
const user = 'stitapplicant';
const password = config.get('apiExternalPassword');

var options = {
    host: "yv1x0ke9cl.execute-api.us-east-1.amazonaws.com",
    path: "/prod/events?classificationName=" + category + "&genreId=" + genreId,
    auth: user + ":" + password
};

router.get('/', (req, res) => {
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
