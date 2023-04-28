import React from "react";

const axios = require('axios');

export default function StravaAuth() {
    const queryParameters = new URLSearchParams(window.location.search)
    const code = queryParameters.get("code") // auth code from URL

    const auth_link = "https://www.strava.com/oauth/token"
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            client_id: '105448',
            client_secret: 'af3c8b34684f5c32341a5494b4562ac4e93d5ac1',
            code: `${code}`,
            grant_type: 'authorization_code'
        }),
    };

    fetch(auth_link, options)
        .then((response) => response.json())
        .then((data) => {
            storeAccessTokenInDB(data);
        })
}

function storeAccessTokenInDB(data) {
    const user = localStorage.getItem('user');
    const token = data['access_token']
    localStorage.setItem('stravaAccessToken', token);

    fetch('http://localhost:3010/v0/token?' + new URLSearchParams({username: user, token: token}), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
      .then((res) => {
          if (!res.ok) {
              throw res;
          }
          return res.json()
      })
      .catch((err) => {
          alert('Error storing strava access token, please try again.');
      });
}
