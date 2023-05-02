import React from 'react';

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
    <AddWorkForm />
    </>
  );
}

