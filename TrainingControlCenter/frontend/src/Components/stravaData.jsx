import axios from 'axios';
import React from 'react';

const stravaBaseURL = 'https://www.strava.com/api/v3';

export const getAllActivities = async () => {
    const user = localStorage.getItem('user');
    const stravaAccessToken = localStorage.getItem('stravaAccessToken');

    var all_activities = [{}];
    try {
        var page = 1;
        var res = await axios.get(`${stravaBaseURL}/athlete/activities`, {
            headers: {
                'Authorization': `Bearer ${stravaAccessToken}`,
            },
            params: {
                'page': page,
                'per_page': 200,
            },
        });
        if (res.status === 200) {
            all_activities += await res.data;
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
                all_activities += res.data;
            }
    } catch (error) {
        console.error('Error fetching all activities:', error);
        return null;
    }
    return all_activities; // here should be uploading to DB not return.
}

export const getFiveActivities = async () => {
    const user = localStorage.getItem('user');
    const stravaAccessToken = localStorage.getItem('stravaAccessToken');
    var activities = [{}];
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
            activities += res
        }
    } catch (error) {
        console.error('Error fetching recent 5 activities:', error);
        return null;
    }
    for (let i = 0; i < activities.length; i++) {
        try {
            const res = await axios.post('localhost:3010/activities/', {
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    username: user,
                    name: activities[i]['id'],
                    sport: activities[i]['sport_type'],
                    type: activities[i]['type'],
                    json: activities[i],
                },
            });
            if (res.status === 200) {
                continue;
            }
        } catch (error) {
            console.error('Error posting activity', activities[i]);
            return null;
        }
    }
    return activities;
}
