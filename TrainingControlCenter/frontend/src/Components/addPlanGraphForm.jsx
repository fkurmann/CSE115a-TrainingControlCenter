import React, { useState } from 'react';
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  Box,
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
import defaultImage from '../Components/images/default.png';
import planPieGraph from '../Components/images/planPieGraph.png';

const localStorageUser = localStorage.getItem('user');

/**
 * Creates form for creating a pie graph with details specified by user.
 *
 * @return {HTMLElement} MUI form for specifying attributes for user specified graph.
 */
export default function AddPlanGraphForm() {
  const [graphGenerated, setGraphGenerated] = useState(false);
  const [{ duration, startDate, graphType, goal }, setState] = useState({
    duration: '',
    startDate: '',
    graphType: '',
    goal: '',
  });

  // Success and error message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = startDate ? new Date(startDate) : null;
      console.log('Trying to call python function');
      const response = await fetch('http://localhost:3010/v0/graphs?' , {
        method: "POST",
        body: JSON.stringify({
          username: localStorageUser,
          duration: duration,
          graphType: graphType,
          sport: 'PlanPie',
          goal: goal,
          startDate: formattedDate,
          outFile: 'planPieGraph'
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 200) {
        setGraphGenerated(true);
        setShowSuccessMessage(true);
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
        setTimeout(() => {
          setErrorMessage('');
        }, 10000);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An graphing error occured.');

      setTimeout(() => {
        setErrorMessage('');
      }, 10000);
    }
  };

  // Duration and graph types to choose from
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
        "Quantity"
      ];
    return graphTypes;
  };

  return (
    <>
    <Box>
    <div className='parent'>
      <div style={{float: 'left'}}>
        <Typography variant="h5">Generate a Graph</Typography><br/>
        <form onSubmit={handleSubmit}>
          <Box sx={{ borderRadius:  '16px', pr: 5, py: 1, boxShadow: 3 }}>
          {/* Graph Type */}
          <Typography variant="h6" ml={2}>Graph Type*</Typography>
          <Box mb={2} ml={2}>
          <Select
            labelId="graph-type-select"
            id="type"
            label="Graph Type"
            value={graphType}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, graphType: e.target.value }))
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
          <Typography variant="h6" ml={2}>Duration*</Typography>
          <Box mb={2} ml={2}>
          <Select
            labelId="duration-select"
            id="type"
            label="Duration"
            value={duration}
            onChange={(e) =>
              setState((prevState) => ({ ...prevState, duration: e.target.value }))
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

          {/* Date */}
          <Box mb={2} ml={2}>
          <Typography variant="h6">Start Date*</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDatePicker
              inputFormat="YYYY-MM-DD"
              required
              value={startDate}
              onChange={(value) =>
                setState((prevState) => ({
                  ...prevState,
                  startDate: value ? value.toISOString() : null,
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
          <Box mb={2} ml={2}>
          <Button variant="contained" color="primary" type="submit" ml={2}>
            Generate Graph
          </Button>
          </Box>
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
          </Box>
        </form>
      </div>
      <div style={{float: 'right'}}>
        <Typography variant="h5" sx={{ px: 3 }}>Planned Training Distribution Graph:</Typography>
        <Box
          component="img"
          sx={{
            height: 400,
            width: 500,
            px: 1
          }}
          alt={defaultImage}
          src={graphGenerated ? planPieGraph : defaultImage}
        />
      </div>
    </div>
  </Box>
  </>
  );
}
