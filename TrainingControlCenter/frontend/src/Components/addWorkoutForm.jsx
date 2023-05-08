
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
  Typography,
  Slider,
  Grid
} from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';


const username = localStorage.getItem('user');

export default function AddWorkoutForm() {
  const [{ name, type, sport }, setState] = useState({
    name: '',
    type: null,
    sport: null,
  });

  // successMessage
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // additionalInfo
  const [additionalInfo, setAdditionalInfo] = useState({
    distance: '',
    altitude: '',

    duration: null,
    durationHours: '',
    durationMinutes: '',
    durationSeconds: '',
    
    datetime: null,
    description: '',
    feelingLevel: '',

    intervalCount: '',
    intervalDistance: '',
  });

  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const duration =
      additionalInfo.durationHours !== '' || additionalInfo.durationMinutes !== '' || additionalInfo.durationSeconds !== ''
        ? (additionalInfo.durationHours * 3600) + (additionalInfo.durationMinutes * 60) + additionalInfo.durationSeconds
        : null;
    
      const response = await fetch('http://localhost:3010/v0/activities?' , {
        method: "POST",
        body: JSON.stringify({
          username: username,
          name: name,
          type: type, 
          sport: sport,
          distance: additionalInfo.distance,
          altitude: additionalInfo.altitude,
          duration: duration,
          datetime: additionalInfo.datetime,
          description: additionalInfo.description,
          feelingLevel: additionalInfo.feelingLevel,
          intervalCount: additionalInfo.intervalCount,
          intervalDistance: additionalInfo.intervalDistance
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
        setState({ name: '', type: '', sport: '' });
        setAdditionalInfo({ distance: '', altitude: '', durationHours: '', durationMinutes: '', durationSeconds: '', 
                            date: null, time: null, description: '', feelingLevel: '',
                            intervalCount: '', intervalDistance: ''});
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
        {/* Name */}
        <Typography variant="h6" ml={2}>Name of Activity</Typography>
        <Box mb={2} ml={2}>
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
        {/* Activity Type */}
        <Typography variant="h6" ml={2}>Activity Type</Typography>
        <Box mb={2} ml={2}>
          <Select
            labelId="activity-type"
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
        {/* Sport */}
          <Box mb={2} ml={2}>
            <Typography variant="h6">Sport Type</Typography>
            <Select
              labelId="sport-type"
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
        {/* Distance */}
        <Box mb={2} ml={2}>
          <Typography variant="h6">Distance (mile)</Typography>
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
        {/* Duration */}
        <Box mb={2} ml={2}>
          <Typography variant="h6">Duration (hh:mm:ss)</Typography>
          <TextField
            id="duration"
            value={`${String(additionalInfo.durationHours).padStart(2, '0')}:${String(
              additionalInfo.durationMinutes
            ).padStart(2, '0')}:${String(additionalInfo.durationSeconds).padStart(
              2,
              '0'
            )}`}
            onChange={(e) => {
              const [hours, minutes, seconds] = e.target.value
                .split(':')
                .map((val) => parseInt(val) || 0);
              setAdditionalInfo((prevState) => ({
                ...prevState,
                durationHours: hours,
                durationMinutes: minutes,
                durationSeconds: seconds,
              }));
            }}
          />
        </Box>
        {/* Additional Information */}
        <Box mb={2} ml={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
        >
          {showAdditionalInfo ? 'Hide' : 'Add'} Additional Information
        </Button>
      </Box>

      <Collapse in={showAdditionalInfo}>
      <Typography variant="h6" ml={2}>Interval</Typography>
      <Box display="flex" alignItems="center" ml={2}>
      <TextField
        id="intervalCount"
        label="Interval count"
        value={additionalInfo.intervalCount}
        onChange={(e) =>
          setAdditionalInfo((prevState) => ({
            ...prevState,
            intervalCount: e.target.value,
          }))
        }
        type="number"
        sx={{ mr: 2 }}
      />
      <TextField
        id="intervalDistance"
        label="Interval distance (mi)"
        value={additionalInfo.intervalDistance}
        onChange={(e) =>
          setAdditionalInfo((prevState) => ({
            ...prevState,
            intervalDistance: e.target.value,
          }))
        }
        type="number"
      />
    </Box>    
        <Box mb={2} ml={2}>
          {/* Altitude */}
          <Typography variant="h6">Altitude (ft)</Typography>
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
        <Box mb={2} ml={2} sx={{ width: 300 }}>
          {/* Feeling level */}
          <Typography variant="h6" id="feeling-slider" gutterBottom>
            Feeling
          </Typography>
          <Slider
            aria-labelledby="feeling-slider"
            value={additionalInfo.feelingLevel}
            marks={[
              { value: 1, label: 'Easy' },
              { value: 5, label: 'Moderate' },
              { value: 10, label: 'Difficult' },
            ]}
            min={1}
            max={10}
            step={1}
            valueLabelDisplay="auto"
            onChange={(event, value) => {
              setAdditionalInfo((prevState) => ({
                ...prevState,
                feelingLevel: value
              }));
            }}
          />
        </Box>
        <Box mb={2} ml={2}>
          {/* Date and time */}
          <Typography variant="h6">Date</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDateTimePicker
              label="Pick a date and time"
              inputFormat="MM/dd/yyyy hh:mm a"
              value={additionalInfo.datetime}
              onChange={(newValue) => {
                setAdditionalInfo((prevState) => ({
                  ...prevState,
                  datetime: newValue
                }));
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <Box mb={2}>
        {/* Description */}
          <Typography variant="h6" ml={2}>Description</Typography>
          <TextField
            id="outlined-multiline-static"
            value={additionalInfo.description}
            onChange={(e) =>
              setAdditionalInfo((prevState) => ({
                ...prevState,
                description: e.target.value,
              }))
            }
            multiline
            fullWidth
            rows={4}
          />
        </Box>
      </Collapse>

        <Button variant="contained" color="primary" type="submit" ml={2}>
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
