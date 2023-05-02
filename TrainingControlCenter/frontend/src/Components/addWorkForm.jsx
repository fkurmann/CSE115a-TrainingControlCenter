import React, { useState } from 'react';
import {
  TextField,
  Button,
  //Typography,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';

const username = localStorage.getItem('user');

export default function AddWorkoutForm() {
  const [{ name, type, sport, distance, time}, setState] = useState({
    name: '',
    type: '',
    sport: '',
    distance: '',
    time: ''
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3010/v0/activities?' , {
        method: "POST",
        body: JSON.stringify({
          username: username,
          name: name,
          sport: sport,
          distance: distance,
          time: time,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      if (response.status === 200) {
        setShowSuccessMessage(true);
        setState({ name: "", type: "", sport: "", distance: "", time: "" });
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 10000);        
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
        setTimeout(() => {
          setErrorMessage('');
        }, 10000);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred. Please try again.');
  
      setTimeout(() => {
        setErrorMessage('');
      }, 10000);
    }
  };
  
  return (
    <>
      {/* <Typography variant="h4" gutterBottom>
        Log a Workout
      </Typography> */}
      <h2>Log a Workout</h2>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            id="name"
            label="Name"
            value={name}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, name: e.target.value }))
            }
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            id="type"
            label="Type"
            value={type}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, type: e.target.value }))
            }
          />
        </Box>
        <Box mb={2}>
          <TextField
            id="sport"
            label="Sport"
            value={sport}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, sport: e.target.value }))
            }
          />
        </Box>
        <Box mb={2}>
          <TextField
            id="distance"
            label="Distance (mile)"
            value={distance}
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                distance: e.target.value,
              }))
            }
            type="number"
          />
        </Box>
        <Box mb={2}>
          <TextField
            id="time"
            label="Time (min)"
            value={time}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, time: e.target.value }))
            }
            type="number"
          />
        </Box>
        <Button variant="contained" color="primary" type="submit">
          Add Workout
        </Button>
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={10000}
          onClose={() => setShowSuccessMessage(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setShowSuccessMessage(false)}>
            Workout added successfully!
          </Alert>
        </Snackbar>
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={10000}
          onClose={() => setErrorMessage('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="error" onClose={() => setErrorMessage('')}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </form>
    </>
  );
}
