import React, { useState } from 'react';
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
  IconButton,
  InputAdornment,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const localStorageUser = localStorage.getItem('user');

/**
 * Creates form for creating a manual activity with details specified by user.
 *
 * @return {HTMLElement} MUI form for specifying attributes for user specified activity.
 */
export default function AddActivityForm() {
  const isMetric = localStorage.getItem('isMetric') ? localStorage.getItem('isMetric') === 'true' : false;
  const dist_unit = isMetric ? 'kilometers' : 'miles';
  const meters_per_unit = isMetric ? 1000 : 1609.34;

  // Types
  const getActivityTypes = () => {
    const activityTypes = [
        "Workout",
        "Race",
        "Endurance",
        "Social",
        "Commute",
      ];
    return activityTypes;
  };

  const sportsList = [
    "Ride",
    "Run",
    "Swim",
    "Walk",
    "Hike",
    "Weight Training",
    "Workout",
    "Row",
    "Ski",
    "VirtualRide",
    "VirtualRun",
  ]; 

  const [{ name, type = '', sport }, setState] = useState({
    name: '',
    type: '',
    sport: '',
  });

  // AdditionalInfo
  const [additionalInfo, setAdditionalInfo] = useState({
    distance: '',
    time: null,
    start_date_local: '',
    description: '',
  });

  // Success and error message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const descriptions = additionalInfo.description.trim() === '' ? null : additionalInfo.description;
      const formattedDate = additionalInfo.start_date_local ? new Date(additionalInfo.start_date_local) : null;
      const response = await fetch('http://localhost:3010/v0/activities?' , {
        method: "POST",
        body: JSON.stringify({
          username: localStorageUser,
          name: name,
          type: type,
          sport: sport,
          description: descriptions,
          distance: additionalInfo.distance * meters_per_unit,
          moving_time: additionalInfo.time,
          start_date: formattedDate,
          start_date_local: formattedDate,
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
        setAdditionalInfo({ distance: '',
                            time: '',
                            date: '',
                            start_date_local: '',
                            description: ''});
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

  return (
    <>
      <Typography variant="h5">Log an Activity</Typography><br/>
      <form onSubmit={handleSubmit}>
        <Box sx={{ borderRadius:  '16px', pr: 2, py: 1, boxShadow: 3 }}>
        {/* Name */}
        <Typography variant="h6" ml={2}>Name of Activity*</Typography>
        <Box mb={2} ml={2}>
        <TextField
          id="name"
          label="Name of Activity"
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
          labelId="activity-type-select"
          id="type"
          value={type}
          onChange={(e) =>
            setState((prevState) => ({ ...prevState, type: e.target.value }))
          }
          autoWidth
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
            labelId={`sport-type-select-2`}
            id={`sport-2`}
            value={sport}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, sport: e.target.value }))
            }
            autoWidth
          >
            {sportsList.map((sportType, index) => (
              <MenuItem key={sportType} value={sportType} id={`menu-item-${sportType}-${index}`}>
                {sportType}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {/* Date */}
        <Box mb={2} ml={2}>
        <Typography variant="h6">Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MobileDatePicker
            inputFormat="YYYY-MM-DD"
            disableFuture
            value={additionalInfo.start_date_local}
            onChange={(value) =>
              setAdditionalInfo((prevState) => ({
                ...prevState,
                start_date_local: value ? value.toISOString() : null,
              }))
            }
            renderInput={(params) => <TextField {...params}
              readOnly
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <EventIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />}
          />
        </LocalizationProvider>
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
      {/* Distance */}
      <Box mb={2} ml={2}>
          <Typography variant="h6">Distance ({dist_unit})</Typography>
          <TextField
            id="distance"
            label="Distance"
            value={additionalInfo.distance}
            onChange={(e) =>
              setAdditionalInfo((prevState) => ({
                ...prevState,
                distance: Number(e.target.value),
              }))
            }
            type="number"
          />
        </Box>
        {/* Time */}
        <Box mb={2} ml={2}>
          <Typography variant="h6">Time (minutes)</Typography>
          <TextField
            id="time"
            label="Time"
            value={additionalInfo.time || ''}
            onChange={(e) => {
              setAdditionalInfo((prevState) => ({
                ...prevState,
                time: Number(e.target.value)
              }));
            }}
            type="number"
            placeholder="Enter time in minutes"
          />
        </Box>
        {/* Description */}
        <Box mb={2}>
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
            sx={{ ml: 2 }}
          />
        </Box>
      </Collapse>
      
      <Box mb={2} ml={2}>
      <Button variant="contained" color="primary" type="submit" ml={2}>
        Add Activity
      </Button>
      </Box>
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={10000}
          onClose={() => setShowSuccessMessage(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setShowSuccessMessage(false)}>
            Activity added successfully!
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
        </Box>
      </form>
    </>
  );
}
