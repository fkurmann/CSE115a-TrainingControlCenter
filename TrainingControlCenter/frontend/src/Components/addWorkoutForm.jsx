
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
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

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
    duration: null,
    
    datetime: null,
    description: '',

    intervalCount: '',
    intervalDistance: '',
  });

  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
      const response = await fetch('http://localhost:3010/v0/activities?' , {
        method: "POST",
        body: JSON.stringify({
          username: username,
          name: name,
          type: type, 
          sport: sport,
          distance: additionalInfo.distance,
          duration: additionalInfo.duration,
          datetime: additionalInfo.datetime,
          description: additionalInfo.description,
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
        setAdditionalInfo({ distance: '', duration: '', 
                            date: '', time: '', description: '',
                            intervalCount: '', intervalDistance: ''});
        setShowAdditionalInfo(false);
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
          <Typography variant="h6">Duration (minutes)</Typography>
          <TextField
            id="duration"
            label="Duration (minute)"
            value={additionalInfo.duration}
            onChange={(e) => {
              setAdditionalInfo((prevState) => ({
                ...prevState,
                duration: e.target.value
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
        {/* Date */}
        <Typography variant="h6">Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateTimePicker', 'DateTimePicker']}>
        <DateTimePicker
          defaultValue={dayjs().startOf('day')}
          inputFormat="YYYY-MM-DD hh:mm A"
          onChange={(value) =>
              setAdditionalInfo((prevState) => ({
                ...prevState,
                datetime: value.toISOString(),
              }))
            }
        />        
        </DemoContainer>
        </LocalizationProvider>
        </Box>
        <Box mb={2}>
        {/* Description */}
          <Typography variant="h6" ml={2} align="top">Description</Typography>
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
            sx={{ ml: 2 }}
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
