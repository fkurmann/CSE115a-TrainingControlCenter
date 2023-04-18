import React from 'react';
import { useSelector } from 'react-redux';

const Workouts = () => {
  const workouts = useSelector((state) => state.workouts);

  console.log(workouts);

  return (
    <h1>Workouts</h1>
  );
}

export default Workouts;