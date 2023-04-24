const StravaApiV3 = require('strava_api_v3');
const fs = require('fs');

var defaultClient = StravaApiV3.ApiClient.instance;

var strava_oauth = defaultClient.authentications['strava_oauth'];
strava_oauth.accessToken = `${process.env.TOKEN}` // take from localStorage.item in future

var callback = function(error, data, response) {
    if (error) {
        console.error('Error getting data', error);
    } else {
        console.log('API called successfully. Returned data: ' + data);
        const jsonString = JSON.stringify(data);
        fs.writeFile('./data/strava_user_data.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
    }
};

function getAthlete() {
    var api = new StravaApiV3.AthletesApi();
    api.getLoggedInAthlete(callback);
}

function getStats(id) {
    var api = new StravaApiV3.AthletesApi();
    api.getStats(id, callback);
}
