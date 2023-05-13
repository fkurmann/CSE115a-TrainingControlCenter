
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
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

const localStorageUser = localStorage.getItem('user');


export default function AddGraphForm() {
  const [{ duration, startDate, graphType, goal, sport, outfile }, setState] = useState({});

  // Success and error message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const formattedDate = additionalInfo.start_date_local ? new Date(additionalInfo.start_date_local) : null;

      // Fetch the correct activities based on the state parameters set by the form, TODO, get request for activities
      const response = await fetch('http://localhost:3010/v0/activities?' , {
        method: "GET",
        body: JSON.stringify({
          username: localStorageUser,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 200) {
        // TODO, send activities to the graphing function along with graphing parameters



        
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
  const getDurationTypes = () => {
    const durationTypes = [
        "Day",
        "Week",
        "Month",
      ];
    return durationTypes;
  };
  const getGraphTypes = () => {
    const graphTypes = [
        "Time",
        "Distance",
      ];
    return graphTypes;
  };

  // Get user favorite for sport types, default is all sports
  const [favoriteSports, setFavoriteSports] = useState(['All Sports']);
  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:3010/v0/favorites?'
                        + new URLSearchParams({username: localStorageUser}));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const favoriteSports = await response.json();
      setFavoriteSports(favoriteSports); // Add all sports option TODO
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
      <h2>Generate a Graph</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <Typography variant="h6" ml={2}>Name of Activity*</Typography>
        {/* Graph Type */}
        <Typography variant="h6" ml={2}>Activity Type</Typography>
        <Box mb={2} ml={2}>
        <Select
          labelId="graph-type-select"
          id="type"
          label="Graph Type"
          value={graphType}
          onChange={(e) =>
            setState((prevState) => ({ ...prevState, type: e.target.value }))
          }
          autoWidth
          required
        >
          {getGraphTypes().map((graphType) => (
            <MenuItem key={graphType} value={graphType}>
              {graphType}
            </MenuItem>
          ))}
        </Select>
        </Box>
        {/* Duration */}
        <Typography variant="h6" ml={2}>Duration</Typography>
        <Box mb={2} ml={2}>
        <Select
          labelId="duration-select"
          id="type"
          label="Duration"
          value={duration}
          onChange={(e) =>
            setState((prevState) => ({ ...prevState, type: e.target.value }))
          }
          autoWidth
          required
        >
          {getDurationTypes().map((durationType) => (
            <MenuItem key={durationType} value={durationType}>
              {durationType}
            </MenuItem>
          ))}
        </Select>
        </Box>
        {/* Sport */}
        <Box mb={2} ml={2}>
          <Typography variant="h6">Sport Type</Typography>
          <Select
            labelId={`sport-type-select`}
            id={`sport`}
            value={sport}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, sport: e.target.value }))
            }
            autoWidth
            label="Sport Type"
          >
            {favoriteSports.map((sportType, index) => (
              <MenuItem key={sportType} value={sportType} id={`menu-item-${sportType}-${index}`}>
                {sportType}
              </MenuItem>
            ))}
          </Select>
        </Box>
        {/* Date */}
        <Box mb={2} ml={2}>
        <Typography variant="h6">Start Date</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['MobileDatePicker']}>
            <MobileDatePicker
              inputFormat="YYYY-MM-DD"
              disableFuture
              onChange={(e) =>
                setState((prevState) => ({ ...prevState, startDate: e.target.value }))
              }
              renderInput={(params) => <TextField {...params} readOnly />}
            />
          </DemoContainer>
        </LocalizationProvider>
        </Box>

      <Button variant="contained" color="primary" type="submit" ml={2}>
        Generate Graph
      </Button>
        <Snackbar
          open={showSuccessMessage}
          autoHideDuration={10000}
          onClose={() => setShowSuccessMessage(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setShowSuccessMessage(false)}>
            Generating graph
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
