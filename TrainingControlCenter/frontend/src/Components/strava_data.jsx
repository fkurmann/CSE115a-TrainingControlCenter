import axios from 'axios';
import React from "react";

const stravaBaseURL = 'https://www.strava.com/api/v3';

export default function getActivities = async (start_date, end_date) => {
    const user = localStorage.getItem('user');
    const stravaAccessToken = localStorage.getItem('stravaAccessToken');

    var all_activities = [{}];
    try {
        page = 1;
        const res = await axios.get(`${stravaBaseURL}/athlete/activities`, {
            headers: {
                'Authorization': `Bearer ${stravaAccessToken}`,
            },
            params: {
                'after': start_date,
                'before': end_date,
                'page': page,
                'per_page': 200,
            },
        });
        if (res.status === 200) {
            all_activities += await res.data;
        }
        while (res.length !== 0) {}
            page += 1;
            const looped_res = await axios.get(`${stravaBaseURL}/athlete/activities`, {
                headers: {
                    'Authorization': `Bearer ${stravaAccessToken}`,
                },
                params: {
                    'after': start_date,
                    'before': end_date,
                    'page': page,
                    'per_page': 200,
                },
            });
            if (looped_res.status === 200) {
                all_activities += looped_res.data;
            }
    } catch (error) {
        console.error('Error fetching all activities:', error);
        return null;
    }
    return all_activities; // here should be uploading to DB not return.
}
