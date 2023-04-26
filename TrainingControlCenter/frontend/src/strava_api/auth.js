const axios = require('axios')

function getStravaToken() {
    const apiBaseUrl = 'https://www.strava.com/api/v3/'

    const endpoints = {
        oauthToken: '/oauth/token',
    }

    const CLIENT_ID = '105448'
    const CLIENT_SECRET = 'af3c8b34684f5c32341a5494b4562ac4e93d5ac1'
    const REFRESH_TOKEN = 'c3a5c02d30b877d15bf4bb0cf278a1d717779eca'
    axios.post(`${apiBaseUrl}${endpoints.oauthToken}`, {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
    })

    .then((response) => {
        const ACCESS_TOKEN = response.data.access_token
        console.log(ACCESS_TOKEN);
    })

    .catch((error) => {
        console.error('file: index.js > axios.post ', error.response.data)
    })
}
module.exports = getStravaToken;
// getStravaToken()
