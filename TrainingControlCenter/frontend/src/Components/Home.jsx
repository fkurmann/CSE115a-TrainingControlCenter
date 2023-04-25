import React from 'react';

import ResponsiveAppBar from './appBar';
import Workouts from './workouts';

export default function Home() {
  return (
    <div>
      <ResponsiveAppBar>

      </ResponsiveAppBar>
    <h1>Training Control Center, Home</h1>
    <Workouts></Workouts>
    </div>
  );
}
