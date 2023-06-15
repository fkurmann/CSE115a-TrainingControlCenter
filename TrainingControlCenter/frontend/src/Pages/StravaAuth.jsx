import React from "react";

/**
 * Authenticates with user's strava account to obtain authorization token.
 */
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
      grant_type: 'authorization_code',
    }),
  };

  fetch(auth_link, options)
    .then((response) => response.json())
    .then((data) => {
      storeAccessTokenInDB(data);
    })
  return (
    <div>Storing Strava Token...
    Redirecting... Please wait 5-10 seconds...</div>
  );
}

/**
 * Stores strava refresh token in to the database
 *
 * @param {string} data - required param showing the JSON response from strava oauth
 */
async function storeAccessTokenInDB(data) {
  const user = localStorage.getItem('user');
  const token = data["refresh_token"]
  console.log(data["access_token"])
  console.log(token);
  await fetch('https://training-control-center-1-0.onrender.com/v0/token?' + new URLSearchParams({username: user, token: token}), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw res;
      }
      window.location.href = 'http://localhost:3000';
      return res
    })
    .catch((err) => {
      alert('Error storing strava access token, please try again.');
    });
}
