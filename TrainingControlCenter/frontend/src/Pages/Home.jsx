import React from 'react';
import { Button } from 'react-bootstrap';

import { getFiveActivities } from '../Components/stravaData';
import ResponsiveAppBar from '../Components/appBar';
import Workouts from '../Components/workouts';
import AddWorkForm from '../Components/addWorkoutForm';


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

