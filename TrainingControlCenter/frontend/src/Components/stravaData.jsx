import axios from 'axios';

const stravaBaseURL = 'https://www.strava.com/api/v3';

/**
 * Obtains refresh token from strava API
 *
 * @return {Object} - JSON object from strava API call with refresh token.
 */
const getRefreshToken = async () => {
  const user = localStorage.getItem('user');
  const response = await fetch('http://localhost:3010/v0/token?' + new URLSearchParams({username: user}), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response) {
    alert(`Error retrieving strava refresh token from database for user ${user}`);
  }
  return response.json();
}

/**
 * Exchanges temporary access token from strava using a user's refresh token.
 *
 * @return {Object} - JSON object from strava API with temporary access token.
 */
const getAccessToken = async () => {
  const user = localStorage.getItem('user');
  const refresh_token = (await getRefreshToken()).stravaToken;
  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: '105448',
      client_secret: 'af3c8b34684f5c32341a5494b4562ac4e93d5ac1',
      refresh_token: refresh_token,
      grant_type: "refresh_token",
    }),
  })
  if (!response) {
    alert(`Error retrieiving strava access token for user ${user}`);
  }
  return response.json();
}

/**
 * Upload strava activities from API call to database.
 *
 * @param {Object} activities - JSON List object of all activities to be uploaded to database.
 */
async function uploadActivities(activities) {
  alert("Uploading... Please stay on this page until receive confirmation.");
  const user = localStorage.getItem('user');
  for (let i = 0; i < activities.length; i++) {
    try {
      // If activity has a description in Strava
      if (i === activities.length - 1) {
        const res = await axios.post('http://localhost:3010/v0/activitiesStrava',
        {
          username: user,
          name: (activities[i]['name']),
          type: (activities[i]['type']),
          sport: (activities[i]['sport_type']),
          description: activities[i]['description'] ? JSON.stringify(activities[i]['description']) : 'No Description',
          json: JSON.parse(JSON.stringify(activities[i])),
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (res.status === 200) {
          continue;
        }
      } else {
        const res = axios.post('http://localhost:3010/v0/activitiesStrava',
        {
          username: user,
          name: (activities[i]['name']),
          type: (activities[i]['type']),
          sport: (activities[i]['sport_type']),
          description: activities[i]['description'] ? JSON.stringify(activities[i]['description']) : 'No Description',
          json: JSON.parse(JSON.stringify(activities[i])),
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (res.status === 200) {
          continue;
        }
      }
    } catch (error) {
      console.error('Error posting activity', activities[i], error);
      return false;
    }
  }
  alert("Successfully stored strava activities!");
  console.log("Stored activities for: ", user);
}

/**
 * Fetches from Strava API to get all user activities and uploads to database.
 *
 * @return {Object} list of all activities from strava API call.
 */
export async function getAllActivities() {
  const stravaAccessToken = (await getAccessToken()).access_token;

  let all_activities = [];
  try {
    let page = 1;
    let res = await axios.get(`${stravaBaseURL}/athlete/activities`, {
      headers: {
        'Authorization': `Bearer ${stravaAccessToken}`,
      },
      params: {
        'page': page,
        'per_page': 200,
      },
    });
    if (res.status === 200) {
      all_activities = res.data;
    }
    while (res.data.length !== 0) {
      page += 1;
      res = await axios.get(`${stravaBaseURL}/athlete/activities`, {
        headers: {
          'Authorization': `Bearer ${stravaAccessToken}`,
        },
        params: {
          'page': page,
          'per_page': 200,
        },
      });
      if (res.status === 200) {
        res.data.forEach(async (activity) => {
          all_activities.push(activity);
        });
      }
    }
  } catch (error) {
    console.error('Error fetching all activities:', error);
    return null;
  }
  uploadActivities(all_activities)
  return all_activities; // here should be uploading to DB not return.
}

/**
 * Fetches from Strava API to get user's latest 5 activities and uploads to database.
 *
 * @return {Object} list of all activities from strava API call.
 */
export async function getFiveActivities() {
  const stravaAccessToken = (await getAccessToken()).access_token;
  let activities = [];
  try {
    const res = await axios.get(`${stravaBaseURL}/athlete/activities`, {
      headers: {
        'Authorization': `Bearer ${stravaAccessToken}`,
      },
      params: {
        'per_page': 5,
      },
    });
    if (res.status === 200) {
      for (let i = 0; i < res.data.length; i++) {
        activities.push(res.data[i]);
      }
    }
  } catch (error) {
    console.error('Error fetching recent 5 activities:', error);
    return null;
  }
  uploadActivities(activities);
  return activities;
}

/**
 * Fetches from Strava API to get detailed information for specified activity.
 *
 * @param {string} id - strava ID of specified activity
 * @return {Object} - JSON object from strava API with activity detailed information.
 */
export async function getActivityDetails(id) {
  const stravaAccessToken = (await getAccessToken()).access_token;
  const res = await axios.get(`${stravaBaseURL}/activities/${id}`, {
    headers: {
      'Authorization': `Bearer ${stravaAccessToken}`
    }
  }).then((res) => {
    return res.data;
  }).catch(function (error) {
    console.error(`Error getting activity ${id}`, error);
    return {};
  });
  return res;
}
