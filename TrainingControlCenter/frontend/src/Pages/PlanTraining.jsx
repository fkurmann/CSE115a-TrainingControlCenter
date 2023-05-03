import React from 'react';

import ResponsiveAppBar from '../Components/appBar';

export default function PlanTraining() {
  return (
    <>
      <ResponsiveAppBar>
      </ResponsiveAppBar>
    <h1>Training Control Center, {localStorage.getItem('user')}: Plan Training</h1>
    </>
  );
}
