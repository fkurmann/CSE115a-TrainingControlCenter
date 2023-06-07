import React, { useEffect, useState, useCallback } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { 
  TextField, 
  Typography, 
  Grid, 
  Paper } 
  from '@mui/material';
import { formatISO } from 'date-fns'
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';

/**
 * Represents the TrainingStats component.
 * @component
 */
function TrainingStats() {
  const localStorageUser = localStorage.getItem('user');
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().startOf('day'));
  const [endDate, setEndDate] = useState(dayjs().endOf('day'));
  const [isLoading, setIsLoading] = useState(true);
  const isMetric = localStorage.getItem('isMetric') ? localStorage.getItem('isMetric') === 'true' : false;
  const dist_unit = isMetric ? 'kilometers' : 'miles';
  const meters_per_unit = isMetric ? 1000 : 1609.34;

  /**
   * Fetches workouts data from the server.
   * @function
   */
  const fetchWorkouts = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3010/v0/plannedActivities?username=${localStorageUser}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const resData = await response.json();
      setData(resData);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }, [localStorageUser]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  /**
   * Converts the start date/ the end date to ISO string format with only the date part.
   * @type {string}
   */
  let startDateISO = formatISO(startDate.toDate(), { representation: 'date' });
  let endDateISO = formatISO(endDate.toDate(), { representation: 'date' });

   /**
    * Calculates the total distance covered within the specified date range.
    * @type {number}
    */
   const totalDistance = data
     .filter(d => d.start_date_local.slice(0, 10) >= startDateISO && d.start_date_local.slice(0, 10) <= endDateISO)
     .reduce((acc, cur) => acc + cur.distance, 0) / meters_per_unit;

   /**
    * Calculates the total time spent within the specified date range.
    * @type {number}
    */
   const totalTimeInSeconds = data
     .filter(d => d.start_date_local.slice(0, 10) >= startDateISO && d.start_date_local.slice(0, 10) <= endDateISO)
     .reduce((acc, cur) => acc + cur.moving_time, 0);

   const days = Math.floor(totalTimeInSeconds / (24 * 60 * 60));
   const hours = Math.floor((totalTimeInSeconds % (24 * 60 * 60)) / (60 * 60));
   const minutes = Math.floor((totalTimeInSeconds % (60 * 60)) / 60);
   const seconds = totalTimeInSeconds % 60;

  return (
    <div>
      <Typography variant="h5">Plan Summary</Typography><br/>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={6} justifyContent="flex-start">
          <Grid item xs={6}>
            <Grid container direction="column" spacing={2} alignItems="flex-start">
              <Grid item xs={12}>
                <DatePicker
                  label="Start date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} />}
                />
                <br/><br/>
                <DatePicker
                  label="End date"
                  value={endDate}
                  onChange={setEndDate}
                  minDate={startDate}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={2} style={{ padding: '10px', width: '415px' }}>
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <>
                      <Typography variant="h6">
                        Total Distance: {totalDistance.toFixed(2)} {dist_unit}
                      </Typography>
                      <Typography variant="h6">
                        Total Time: {`${days.toString().padStart(2, '0')}:
                                    ${hours.toString().padStart(2, '0')}:
                                    ${minutes.toString().padStart(2, '0')}:
                                    ${seconds.toString().padStart(2, '0')}`}
                      </Typography>
                    </>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </div>
  );
}

export default TrainingStats;
