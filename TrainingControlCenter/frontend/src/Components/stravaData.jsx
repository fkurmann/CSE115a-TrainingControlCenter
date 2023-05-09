import axios from 'axios';

const stravaBaseURL = 'https://www.strava.com/api/v3';

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
  console.log("Stored activities for: ", user);
}

export async function getAllActivities() {
  const stravaAccessToken = localStorage.getItem('stravaAccessToken');

  var all_activities = [];
  try {
    var page = 1;
    var res = await axios.get(`${stravaBaseURL}/athlete/activities`, {
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
    while (res.length !== 0) {}
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
        for (let i = 0; i < res.data.length; i++) {
          all_activities.push(res.data[i]);
        }
      }
  } catch (error) {
    console.error('Error fetching all activities:', error);
    return null;
  }
  uploadActivities(all_activities)
  return all_activities; // here should be uploading to DB not return.
}

export async function getFiveActivities() {
  const stravaAccessToken = localStorage.getItem('stravaAccessToken');
  var activities = [];
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
