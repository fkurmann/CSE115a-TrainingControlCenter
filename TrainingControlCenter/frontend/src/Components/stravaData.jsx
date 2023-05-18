import axios from 'axios';

const stravaBaseURL = 'https://www.strava.com/api/v3';

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

async function uploadActivities(activities) {
  const user = localStorage.getItem('user');
  for (let i = 0; i < activities.length; i++) {
    try {
      // If activity has a description in Strava
      if (activities[i]['description']) {
        const res = await axios.post('http://localhost:3010/v0/activitiesStrava',
        {
          username: user,
          name: (activities[i]['name']),
          type: (activities[i]['type']),
          sport: (activities[i]['sport_type']),
          description: JSON.stringify(activities[i]['description']),
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
        // If activity has no description in Strava
        const res = await axios.post('http://localhost:3010/v0/activitiesStrava',
        {
          username: user,
          name: (activities[i]['name']),
          type: (activities[i]['type']),
          sport: (activities[i]['sport_type']),
          description: 'No description',
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
      return null;
    }
  }
  alert("Successfully stored strava activities!"); // react mui box here instead
  console.log("Stored activities for: ", user);
}

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
        'per_page': 100,
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
        console.log(res.data.length);
        for (let i = 0; i < res.data.length; i++) {
          all_activities.push(res.data[i]);
        }
      }
      await new Promise(r => setTimeout(r, 4000));
    }
  } catch (error) {
    console.error('Error fetching all activities:', error);
    return null;
  }
  uploadActivities(all_activities)
  return all_activities; // here should be uploading to DB not return.
}

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
