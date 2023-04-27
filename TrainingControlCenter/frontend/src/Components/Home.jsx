import React from 'react';

import ResponsiveAppBar from './appBar';
import Workouts from './workouts';

import CalendarWeekly from './calendarWeekly';

export default function Home() {
  //const stravaAccessToken = localStorage.getItem('stravaAccessToken'); // Retrieve the Strava access token;
  return (
    <>
      <ResponsiveAppBar>

      </ResponsiveAppBar>
    <h1>Training Control Center, Home</h1>
    <div>
      <div style={{ float: 'left', width: '50%' }}>
        <Workouts></Workouts>
      </div>

      <div style={{ float: 'right', width: '50%' }}>
        <header>
          <CalendarWeekly></CalendarWeekly>
        </header>
      </div>
    </div>

    </>
  );
}
