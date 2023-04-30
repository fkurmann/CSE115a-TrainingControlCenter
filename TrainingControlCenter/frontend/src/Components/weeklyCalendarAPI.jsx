import axios from 'axios';

const stravaBaseURL = 'https://www.strava.com/api/v3';

export const getActivities = async (accessToken, startDate, endDate) => {
  try {
    const response = await axios.get(`${stravaBaseURL}/athlete/activities`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      params: {
        'start_date_local': startDate,
        'end_date_local': endDate,
        'per_page': 100,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error('Error fetching activities:', error);
    return null;
  }
};
