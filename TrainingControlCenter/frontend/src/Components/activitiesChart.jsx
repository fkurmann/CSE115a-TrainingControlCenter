import React, { useCallback, useEffect, useState } from 'react';
import { Grid, Typography, Paper, Button, ButtonGroup, Select, MenuItem } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
//import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { format, getISOWeek, startOfWeek, endOfWeek, getMonth, getYear, startOfMonth, endOfMonth, startOfYear, endOfYear, addDays, eachMonthOfInterval } from 'date-fns';
import { eachDayOfInterval } from 'date-fns';
import SportIcon from './sportIcon';

const localStorageUser = localStorage.getItem('user');

const ActivityChart = () => {
  //const [activities, setActivities] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedCompare, setSelectedCompare] = useState(getCurrentWeek());
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [compareActivities, setCompareActivities] = useState([]);
  const [rankingLoading, setRankingLoading] = useState(false);
  const [noRecords, setNoRecords] = useState(false);
  const [weekRange, setWeekRange] = useState('');

  function getCurrentWeek() {
    const currentDate = new Date();
    const currentWeek = getISOWeek(currentDate);
    return currentWeek;
  }

  function getCurrentMonth() {
    const currentDate = new Date();
    const currentMonth = getMonth(currentDate) + 1;
    return currentMonth;
  }  
  
  function getCurrentYear() {
    const currentYear = new Date().getFullYear();
    return currentYear;
  }
  
  function getDateRange(weekNumber) {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysPerWeek = 7;

    // Subtract 1 because weekNumber is 1-based
    const weekStart = new Date(startOfYear.getTime() + ((weekNumber - 1) * daysPerWeek * millisecondsPerDay));

    return weekStart;  
  }

  function getEndDate(weekNumber) {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysPerWeek = 7;
  
    // Subtract 1 because weekNumber is 1-based
    const weekEnd = new Date(startOfYear.getTime() + (weekNumber * daysPerWeek * millisecondsPerDay) - millisecondsPerDay);
  
    return weekEnd;  
  }

  const fetchDataForFirstRanking = async () => {
    try {
      setRankingLoading(true);
      const response = await fetch(`http://localhost:3010/v0/activities?username=${localStorageUser}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fetchedActivities = await response.json();
      const activitiesWithDistance = fetchedActivities.filter(activity => activity.distance > 0);

      const activitySum = activitiesWithDistance.reduce((prev, curr) => {
        if (!prev[curr.type]) {
          prev[curr.type] = { ...curr };
        } else {
          prev[curr.type].distance += curr.distance;
          prev[curr.type].moving_time += Number(curr.moving_time);
        }
        return prev;
      }, {});

      const activitySumArray = Object.values(activitySum);

      if (activitySumArray.length === 0) {
        setNoRecords(true);
      } else {
        setNoRecords(false);
      }

      const filtered = activitySumArray
      .filter((activity) => {
        const activityDate = new Date(activity.start_date_local);

        if (selectedPeriod === 'week') {
          const weekStart = getDateRange(selectedWeek);
          const weekEnd = getEndDate(selectedWeek);
          return activityDate >= weekStart && activityDate <= weekEnd;
        } else if (selectedPeriod === 'month') {
          return getMonth(activityDate) + 1 === selectedMonth && getYear(activityDate) === getCurrentYear();
        } else if (selectedPeriod === 'year') {
          return getYear(activityDate) === selectedYear;
        }
        return true;
      })
      // Sort activities by start date
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
  
      setFilteredActivities(filtered);  
      setRankingLoading(false);  
    } catch (error) {
      setRankingLoading(false);
      console.error('An error occurred. Please try again.');
    }
  };

  const fetchDataForSecondRanking = async () => {
    try {
      setRankingLoading(true);
      const response = await fetch(`http://localhost:3010/v0/activities?username=${localStorageUser}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fetchedActivities = await response.json();
      const activitiesWithDistance = fetchedActivities.filter(activity => activity.distance > 0);

      const activitySum = activitiesWithDistance.reduce((prev, curr) => {
        if (!prev[curr.type]) {
          prev[curr.type] = { ...curr };
        } else {
          prev[curr.type].distance += curr.distance;
          prev[curr.type].moving_time += Number(curr.moving_time);
        }
        return prev;
      }, {});

      const activitySumArray = Object.values(activitySum);

      const compareFiltered = activitySumArray
      .filter((activity) => {
        const activityDate = new Date(activity.start_date_local);
        if (selectedPeriod === 'week') {
          const weekStart = getDateRange(selectedCompare);
          const weekEnd = getEndDate(selectedCompare);
          return activityDate >= weekStart && activityDate <= weekEnd;
        } else if (selectedPeriod === 'month') {
          return getMonth(activityDate) + 1 === selectedCompare && getYear(activityDate) === getCurrentYear();
        } else if (selectedPeriod === 'year') {
          return getYear(activityDate) === selectedCompare;
        }
        return true;
      })
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
      
      setCompareActivities(compareFiltered); 
      setRankingLoading(false);      
    } catch (error) {
      setRankingLoading(false);
      console.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    fetchDataForFirstRanking();
  }, [selectedPeriod, selectedWeek, selectedMonth, selectedYear]);
  
  useEffect(() => {
    fetchDataForSecondRanking();
  }, [selectedPeriod, selectedCompare]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  
    if (period === 'month') {
      setSelectedMonth(getCurrentMonth());
      setSelectedCompare(getCurrentMonth());
    } else if (period === 'week') {
      setSelectedWeek(getCurrentWeek());
      setSelectedCompare(getCurrentWeek());
    } else if (period === 'year') {
      setSelectedYear(getCurrentYear());
      setSelectedCompare(getCurrentYear());
    }
  };
  
  const handleWeekChange = (event) => {
    const selectedWeek = event.target.value;
    setSelectedWeek(selectedWeek);
  };
  
  const handleMonthChange = (event) => {
    const value = event.target.value;
    setSelectedMonth(value);
  };  

  const handleYearChange = (event) => {
    const value = event.target.value;
    setSelectedYear(value);
  };

  const handleCompareChange = (event) => {
    if (selectedPeriod === 'week') {
      setSelectedCompare(event.target.value);
    } else if (selectedPeriod === 'month') {
      setSelectedCompare(event.target.value);
    } else if (selectedPeriod === 'year') {
      setSelectedCompare(event.target.value);
    }
  };
  
  const getChartData = (activities, period) => {
    let range = [];
    let formatStr = "";
  
    if (period === "week") {
      // Use the start and end of the week to generate the range
      const start = startOfWeek(new Date());
      const end = endOfWeek(new Date());
      range = eachDayOfInterval({ start, end });
      formatStr = 'E';
    } else if (period === "month") {
      // Use the start and end of the month to generate the range
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      range = eachDayOfInterval({ start, end });
      formatStr = 'd';
    } else if (period === "year") {
      // Use the start and end of the year to generate the range
      const start = startOfYear(new Date());
      const end = endOfYear(new Date());
      range = eachMonthOfInterval({ start, end });
      formatStr = 'MMM';
    }
  
    return range.map(date => {
      // Find activities for this date
      const activitiesForDate = activities.filter(activity => {
        const activityDate = new Date(activity.start_date_local);
        return activityDate >= date && activityDate < addDays(date, 1);
      });
  
      // Calculate total distance and time for this date
      let totalDistance = 0;
      let totalTime = 0;
      for (let activity of activitiesForDate) {
        totalDistance += activity.distance;
        totalTime += activity.moving_time;
      }
  
      // Return data for this date
      return {
        name: format(date, formatStr),
        distance: totalDistance,
        time: totalTime,
        id: activities.id,
      };
    });
  };
  
  const chartData = getChartData(filteredActivities, selectedPeriod);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>

        <ButtonGroup color="primary" aria-label="period">
          <Button
            variant={selectedPeriod === 'week' ? 'contained' : 'outlined'}
            onClick={() => handlePeriodChange('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'contained' : 'outlined'}
            onClick={() => handlePeriodChange('month')}
          >
            Month
          </Button>
          <Button
            variant={selectedPeriod === 'year' ? 'contained' : 'outlined'}
            onClick={() => handlePeriodChange('year')}
          >
            Year
          </Button>
        </ButtonGroup>

    {/* Week, Month, Year Button: dropdown list */}
    {(selectedPeriod === 'week' || selectedPeriod === 'month' || selectedPeriod === 'year') && (
      <Grid container spacing={2} style={{ width: '100%', margin: '20px auto' }}>
        <Grid item xs={6}>
          <Select
            value={
              selectedPeriod === 'week'
                ? selectedWeek
                : selectedPeriod === 'month'
                ? selectedMonth
                : selectedYear
            }
            onChange={(event) => {
              if (selectedPeriod === 'week') {
                setSelectedWeek(event.target.value);
              } else if (selectedPeriod === 'month') {
                setSelectedMonth(event.target.value);
              } else if (selectedPeriod === 'year') {
                setSelectedYear(event.target.value);
              }
            }}
            label={
              selectedPeriod === 'week'
                ? 'Week'
                : selectedPeriod === 'month'
                ? 'Month'
                : 'Year'
            }
          >
            {selectedPeriod === 'week' &&
              [...Array(52).keys()].map((week) => (
                <MenuItem key={week + 1} value={week + 1}>
                  {`Week ${week + 1} (${format(getDateRange(week + 1), 'M/d')}-${format(getEndDate(week + 1), 'M/d')})`}
                </MenuItem>
              ))}
            {selectedPeriod === 'month' &&
              [...Array(12).keys()].map((month) => (
                <MenuItem key={month + 1} value={month + 1}>
                  {`${format(new Date(2000, month), 'MMMM')}`}
                </MenuItem>
              ))}
            {selectedPeriod === 'year' &&
              [...Array(6).keys()].map((index) => {
                const year = getCurrentYear() - index;
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
          </Select>
        </Grid>
        <Grid item xs={6}>
          <Select
            value={selectedCompare}
            onChange={handleCompareChange}
            label={
              selectedPeriod === 'week'
                ? 'Week'
                : selectedPeriod === 'month'
                ? 'Month'
                : 'Year'
            }
          >
            {selectedPeriod === 'week' &&
              [...Array(52).keys()].map((week) => (
                <MenuItem key={week + 1} value={week + 1}>
                  {`Week ${week + 1} (${format(getDateRange(week + 1), 'M/d')}-${format(getEndDate(week + 1), 'M/d')})`}
                </MenuItem>
              ))}
            {selectedPeriod === 'month' &&
              [...Array(12).keys()].map((month
              ) => (
                <MenuItem key={month + 1} value={month + 1}>
                  {`${format(new Date(2000, month), 'MMMM')}`}
                </MenuItem>
              ))}
            {selectedPeriod === 'year' &&
              [...Array(6).keys()].map((index) => {
                const year = getCurrentYear() - index;
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
          </Select>
        </Grid>
      </Grid>
    )}

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography>First Ranking</Typography>
        {rankingLoading ? (
          <CircularProgress />
        ) : filteredActivities.length === 0 ? (
          <p>No records for this period</p>
        ) : (
          filteredActivities.map(activity => (
            <Paper key={activity._id}>
              <SportIcon sport={activity.type} />
              <p>{activity.type} - {activity.distance} km - {activity.moving_time} minutes</p>
            </Paper>
          ))
        )}
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography>Second Ranking</Typography>
        {rankingLoading ? (
          <CircularProgress />
        ) : compareActivities.length === 0 ? (
          <p>No records for this period</p>
        ) : (
          compareActivities.map(activity => (
            <Paper key={chartData.id}>
              <SportIcon sport={activity.type} />
              <p>{activity.type} - {activity.distance} km - {activity.moving_time} minutes</p>
            </Paper>
          ))
        )}
      </Grid>
    </Grid>

    {/* Place chart */}
    {/* First chart */}
    {/* <div style={{ marginTop: '20px' }}>
      <Typography variant="h6">Activity Chart</Typography>
      <LineChart
        width={500}
        height={300}
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line key={chartData.id} type="monotone" dataKey="distance" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="time" stroke="#82ca9d" />
      </LineChart>
    </div> */}
    
    </div>
  );
};

export default ActivityChart;
