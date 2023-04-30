import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

export default function AddWorkoutForm({ addWorkout }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [sport, setSport] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addWorkout(name, type, sport, distance, time);
    setName('');
    setType('');
    setSport('');
    setDistance('');
    setTime('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <TextField
        label="Sport"
        value={sport}
        onChange={(e) => setSport(e.target.value)}
      />
      <TextField
        label="Distance"
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        type="number"
      />
      <TextField
        label="Time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        type="number"
      />
      <Button type="submit">Add Workout</Button>
    </form>
  );
}