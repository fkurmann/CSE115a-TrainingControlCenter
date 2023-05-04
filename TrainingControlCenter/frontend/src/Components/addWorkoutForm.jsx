
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
  InputLabel
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

  // successMessage
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // additionalInfo
  const [additionalInfo, setAdditionalInfo] = useState({
    minDuration: '',
    maxDuration: '',
    minDistance: '',
    maxDistance: '',
    minDate: '',
    maxDate: ''
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
          distance: distance,
          time: time,
          minDuration: additionalInfo.minDuration,
          maxDuration: additionalInfo.maxDuration,
          minDistance: additionalInfo.minDistance,
          maxDistance: additionalInfo.maxDistance,
          minDate: additionalInfo.minDate,
          maxDate: additionalInfo.maxDate
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

  // get sport types
  const getSportTypes = () => {
    const activityTypes = [
      "Favorites"
    ];
  
    return activityTypes;
  };
  

  return (
    <>
      <h2>Log a Workout</h2>
      <form onSubmit={handleSubmit}>
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
        <Box mb={2}>
          <InputLabel id="activity type">Type</InputLabel>
          <Select
            labelId="activity type"
            id="type"
            value={type}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, type: e.target.value }))
            }
            fullWidth
          >
            {getActivityTypes().map((activityType) => (
              <MenuItem key={activityType} value={activityType}>
                {activityType}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box mb={2}>
          <InputLabel id="sport type">Type</InputLabel>
          <Select
            labelId="sport type"
            id="sport"
            value={sport}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, sport: e.target.value }))
            }
            fullWidth
          >
            {getSportTypes().map((sportType) => (
              <MenuItem key={sportType} value={sportType}>
                {sportType}
              </MenuItem>
            ))}
          </Select>
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
          <Box mb={2}>
            <TextField
              id="minDuration"
              label="The minimum duration of an activity, seconds"
              value={additionalInfo.minDuration}
              //style={{ width: "30%" }}
              fullWidth
              onChange={(e) =>
                setAdditionalInfo((prevState) => ({ ...prevState, minDuration: e.target.value }))
              }
            />
          </Box>
          <Box mb={2}>
            <TextField
              id="maxDuration"
              label="The maximum duration of an activity, seconds"
              value={additionalInfo.maxDuration}
              style={{ width: "20%" }}
              onChange={(e) =>
                setAdditionalInfo((prevState) => ({ ...prevState, maxDuration: e.target.value }))
              }
            />
          </Box>
          <Box mb={2}>
            <TextField
              id="minDistance"
              label="The minimum distance of an activity"
              value={additionalInfo.minDistance}
              style={{ width: "20%" }}
              onChange={(e) =>
                setAdditionalInfo((prevState) => ({ ...prevState, minDistance: e.target.value }))
              }
            />
          </Box>
          <Box mb={2}>
            <TextField
              id="maxDistance"
              label="The maximum distance of an activity"
              value={additionalInfo.maxDistance}
              style={{ width: "20%" }}
              onChange={(e) =>
                setAdditionalInfo((prevState) => ({ ...prevState, maxDistance: e.target.value }))
              }
            />
          </Box>
          <Box mb={2}>
            <TextField
              id="minDate"
              label="minDate"
              value={additionalInfo.minDate}
              style={{ width: "20%" }}
              onChange={(e) =>
                setAdditionalInfo((prevState) => ({ ...prevState, minDate: e.target.value }))
              }
            />
          </Box>
          <Box mb={2}>
            <TextField
              id="maxDate"
              label="maxDate"
              value={additionalInfo.maxDate}
              style={{ width: "20%" }}
              onChange={(e) =>
                setAdditionalInfo((prevState) => ({ ...prevState, maxDate: e.target.value }))
              }
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
