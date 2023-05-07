
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
  Collapse,
  MenuItem, 
  Select, 
  InputLabel
} from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';


const username = localStorage.getItem('user');

export default function AddWorkoutForm() {
  const [{ name, type, sport}, setState] = useState({
    name: '',
    type: '',
    sport: ''
  });

  // successMessage
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // additionalInfo
  const [additionalInfo, setAdditionalInfo] = useState({
    altitude: '',
    durationHours: '',
    durationMinutes: '',
    durationSeconds: '',
    datetime: '',
    description: ''
  });

  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const duration = (additionalInfo.durationHours * 3600) + (additionalInfo.durationMinutes * 60) + additionalInfo.durationSeconds;
      const response = await fetch('http://localhost:3010/v0/activities?' , {
        method: "POST",
        body: JSON.stringify({
          username: username,
          name: name,
          type: type, 
          sport: sport,
          distance: additionalInfo.distance,
          duration: duration,
          altitude: additionalInfo.altitude,
          datetime: additionalInfo.datetime.toISOString(),
          description: additionalInfo.description
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
        setState({ name: "", type: "", sport: "", distance: "" });
        setAdditionalInfo({ altitude: '', durationHours: '', durationMinutes: '', durationSeconds: '', date: null, time: null });
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
  
  // get activity types
  const getActivityTypes = () => {
    const activityTypes = [
        "Workout",
        "Race",
        "Endurance",
        "Social",
        "Commute"
      ];
    return activityTypes;
  };

  // get user favorite for sport types
  const [favoriteSports, setFavoriteSports] = useState([]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:3010/v0/favorites?' 
                        + new URLSearchParams({username: username}));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const favoriteSports = await response.json();
      setFavoriteSports(favoriteSports);
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred. Please try again.');

      setTimeout(() => {
        setErrorMessage('');
      }, 10000);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <>
      <h2>Log a Workout</h2>
      <form onSubmit={handleSubmit}>
        {/* name */}
        <Box mb={2}>
          <TextField
            id="name"
            label="Name"
            helperText="Name of activity"
            value={name}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, name: e.target.value }))
            }
            required
          />
        </Box>
        {/* activity type */}
        <Box mb={2}>
          <InputLabel id="activity type">Type</InputLabel>
          <Select
            labelId="activity type"
            id="type"
            value={type}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, type: e.target.value }))
            }
            halfWidth
          >
            {getActivityTypes().map((activityType) => (
              <MenuItem key={activityType} value={activityType}>
                {activityType}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {/* sport type */}
        <Box mb={2}>
        <InputLabel id="sport type">Sport</InputLabel>
        <Select
          labelId="sport type"
          id="sport"
          value={sport}
          onChange={(e) =>
            setState((prevState) => ({ ...prevState, sport: e.target.value }))
          }
          halfWidth
        >
          {favoriteSports.map((sportType) => (
            <MenuItem key={sportType} value={sportType}>
              {sportType}
            </MenuItem>
          ))}
        </Select>
        </Box>
        {/* distance */}
        <Box mb={2}>
        <TextField
          id="distance"
          label="Distance (mile)"
          value={additionalInfo.distance}
          onChange={(e) =>
            setAdditionalInfo((prevState) => ({
              ...prevState,
              distance: e.target.value,
            }))
          }
          type="number"
        />
        </Box>
        {/* duration*/}
        <Box mb={2}>
        <TextField
          id="duration"
          label="Duration (hh:mm:ss)"
          value={`${String(additionalInfo.durationHours).padStart(2, '0')}:${String(additionalInfo.durationMinutes).padStart(2, '0')}:${String(additionalInfo.durationSeconds).padStart(2, '0')}`}
          onChange={(e) => {
            const [hours, minutes, seconds] = e.target.value.split(':').map((val) => parseInt(val) || 0);
            setAdditionalInfo((prevState) => ({
              ...prevState,
              durationHours: hours,
              durationMinutes: minutes,
              durationSeconds: seconds,
            }));
          }}
        />
        </Box>      
        {/* additional information */}
        <Box mt={2} mb={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
          >
            {showAdditionalInfo ? 'Hide' : 'Add'} Additional Info
          </Button>
        </Box>
        <Collapse in={showAdditionalInfo}>
        {/* altitude */}
        <Box mb={2}>
        <TextField
          id="altitude"
          label="Altitude (ft)"
          value={additionalInfo.altitude}
          onChange={(e) =>
            setAdditionalInfo((prevState) => ({
              ...prevState,
              altitude: e.target.value,
            }))
          }
          type="number"
        />
        </Box>
        {/* date and time */}
        <Box mb={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDateTimePicker
              label="Pick a date and time"
              inputFormat="MM/dd/yyyy hh:mm a"
              value={additionalInfo.datetime}
              onChange={(newValue) => {
                setAdditionalInfo((prevState) => ({ ...prevState, datetime: newValue })); // Modified this line
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        {/* description */}
        <Box mb={2}>
        <TextField
          id="description"
          label="Description"
          value={additionalInfo.description}
          onChange={(e) =>
            setAdditionalInfo((prevState) => ({
              ...prevState,
              description: e.target.value,
            }))
          }
          multiline
          rows={4}
        />
        </Box>
        </Collapse>
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
