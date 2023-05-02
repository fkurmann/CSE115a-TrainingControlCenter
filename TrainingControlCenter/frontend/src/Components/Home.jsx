import React from 'react';
import { Button } from 'react-bootstrap';

import { getFiveActivities } from './stravaData';
import ResponsiveAppBar from './appBar';
import Workouts from './workouts';
import AddWorkForm from './addWorkForm';


export default function Home() {
  return (
    <>
      <ResponsiveAppBar>

      </ResponsiveAppBar>
    <h1>Training Control Center, {localStorage.getItem('user')}</h1>
    <Workouts></Workouts>
    <Button
      onClick={() => getFiveActivities()}>Upload Activities From Strava!
    </Button>

    <AddWorkForm />
    </>
  );
}

