import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getActivities } from './weeklyCalendarAPI';

const localizer = momentLocalizer(moment);

const WeeklyCalendar = () => {
  const [activities, setActivities] = useState([]);
  const stravaAccessToken = localStorage.getItem('stravaAccessToken'); // Retrieve the Strava access token

  useEffect(() => {
    if (stravaAccessToken) {
      const startDate = moment().startOf('week').toDate(); // Get activities from the start of this week
      const endDate = moment().endOf('week').toDate(); // Get activities until the end of this week

      getActivities(stravaAccessToken, startDate.toISOString(), endDate.toISOString())
        .then((data) => {
          if (data) {
            const formattedActivities = data.map((activity) => {
              const start = new Date(activity.start_date_local);
              return {
                title: activity.name,
                start: start,
                end: start, // Set the end time to be the same as the start time
                allDay: true,
              };
            });

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
          //views={['agenda']}
          defaultView="week"
          style={{ height: '100%' }}
        />
      </div>
    </div>
  );
};

export default WeeklyCalendar;
