import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getActivities } from './stravaAPI';

const localizer = momentLocalizer(moment);

const WeeklyCalendar = () => {
  const [activities, setActivities] = useState([]);
  const stravaAccessToken = localStorage.getItem('stravaAccessToken'); // Retrieve the Strava access token

  useEffect(() => {
    if (stravaAccessToken) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7); // Get activities from one week ago

      const endDate = new Date();

      getActivities(stravaAccessToken, startDate.toISOString(), endDate.toISOString())
        .then((data) => {
          if (data) {
            const formattedActivities = data.map((activity) => ({
              title: activity.name,
              start: new Date(activity.start_date_local),
              end: new Date(activity.start_date_local + activity.elapsed_time * 1000),
              allDay: false,
            }));

            setActivities(formattedActivities);
          }
        })
        .catch((error) => {
          console.error('Error fetching activities:', error);
        });
    }
  }, [stravaAccessToken]);

  return (
    <div>
      <h1>Your Weekly Activities</h1>
      <div style={{ height: '500px' }}>
        <Calendar
          localizer={localizer}
          events={activities}
          startAccessor="start"
          endAccessor="end"
          views={['week']}
          defaultView="week"
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

export default WeeklyCalendar;
