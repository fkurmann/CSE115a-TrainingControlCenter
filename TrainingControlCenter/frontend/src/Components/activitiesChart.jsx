import moment from 'moment';
import SportIcon from './sportIcon';
import React, { useEffect, useState } from 'react';
import { Grid, Typography, Paper, Button, ButtonGroup, Select, MenuItem, CircularProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, getISOWeek, startOfWeek, getMonth, getYear} from 'date-fns';
import { enUS } from 'date-fns/locale'

const localStorageUser = localStorage.getItem('user');

const ActivityChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedCompare, setSelectedCompare] = useState(getCurrentWeek());
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [compareActivities, setCompareActivities] = useState([]);
  const [firstRankingLoading, setFirstRankingLoading] = useState(false);
  const [secondRankingLoading, setSecondRankingLoading] = useState(false);
  const [noRecords, setNoRecords] = useState(false);
  const [firstChartData, setFirstChartData] = useState([]);
  const [secondChartData, setSecondChartData] = useState([]);
  const metersToMiles = 0.000621371;

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
      setFirstRankingLoading(true);
      const response = await fetch(`http://localhost:3010/v0/activities?username=${localStorageUser}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const fetchedActivities = await response.json();
      const activitiesWithTime = fetchedActivities.filter(activity => activity.moving_time > 0);
  
      // First, filter and sort activities by selectedPeriod
      const filteredAndSorted = activitiesWithTime
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
      
      // Then, sum up the moving_time and distance for the same type of activities
      const activitySum = filteredAndSorted.reduce((prev, curr) => {
        if (!prev[curr.sport]) {
          prev[curr.sport] = { ...curr };
        } else {
          prev[curr.sport].distance += curr.distance;
          prev[curr.sport].moving_time += Number(curr.moving_time);
        }
        return prev;
      }, {});
  
      const activitySumArray = Object.values(activitySum);
  
      if (activitySumArray.length === 0) {
        setNoRecords(true);
      } else {
        setNoRecords(false);
      }
    
      setFilteredActivities(activitySumArray);
      getFirstChartData(activitySumArray, selectedPeriod);
      setFirstRankingLoading(false);
    } catch (error) {
      setFirstRankingLoading(false);
      console.error('An error occurred. Please try again.');
    }
  };  

  useEffect(() => {
    fetchDataForFirstRanking();
  }, [selectedPeriod, selectedWeek, selectedMonth, selectedYear]);

  const fetchDataForSecondRanking = async () => {
    try {
      setSecondRankingLoading(true);
      const response = await fetch(`http://localhost:3010/v0/activities?username=${localStorageUser}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const fetchedActivities = await response.json();
      const activitiesWithTime = fetchedActivities.filter(activity => activity.moving_time > 0);
  
      // First, filter and sort activities by selectedCompare
      const filteredAndSorted = activitiesWithTime
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
      
      // Then, sum up the moving_time and distance for the same type of activities
      const activitySum = filteredAndSorted.reduce((prev, curr) => {
        if (!prev[curr.sport]) {
          prev[curr.sport] = { ...curr };
        } else {
          prev[curr.sport].distance += curr.distance;
          prev[curr.sport].moving_time += Number(curr.moving_time);
        }
        return prev;
      }, {});
  
      const activitySumArray = Object.values(activitySum);
      
      setCompareActivities(activitySumArray);
      getSecondChartData(activitySumArray, selectedPeriod);
      setSecondRankingLoading(false);
    } catch (error) {
      setSecondRankingLoading(false);
      console.error('An error occurred. Please try again.');
    }
  };
  

  useEffect(() => {
    fetchDataForSecondRanking();
  }, [selectedPeriod, selectedCompare]);

  const handlePeriodChange = async (period) => {
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
  
  const getFirstChartData = (activities, period) => {
    let selectedActivities = [];
    let firstChartData = [];
    let rangeStart;
    let rangeDays;

    if (period === 'week') {
      selectedActivities = activities.filter(activity => {
        const weekStart = startOfWeek(new Date(activity.start_date_local), { weekStartsOn: 1 });
        const weekNumber = getISOWeek(weekStart);
        return weekNumber === selectedWeek;
      });
      rangeStart = getDateRange(selectedWeek);
      rangeDays = 7;
    } else if (period === 'month') {
      selectedActivities = activities.filter(activity => {
        const activityMonth = getMonth(new Date(activity.start_date_local)) + 1;
        return activityMonth === selectedMonth;
      });
      rangeStart = new Date(selectedYear, selectedMonth - 1, 1);
      rangeDays = new Date(selectedYear, selectedMonth, 0).getDate(); // Get number of days in the month
    } else if (period === 'year') {
      selectedActivities = activities.filter(activity => {
        const activityYear = getYear(new Date(activity.start_date_local));
        return activityYear === selectedYear;
      });
      rangeStart = new Date(selectedYear, 0, 1);
      rangeDays = 12; // Months in the year
    }
    for (let i = 0; i < rangeDays; i++) {
      const currentDate = selectedPeriod === 'year' 
        ? new Date(rangeStart.getFullYear(), rangeStart.getMonth() + i, 1)
        : new Date(rangeStart.getTime() + i * 24 * 60 * 60 * 1000);
  
      const formattedDate = selectedPeriod === 'year'
        ? format(currentDate, 'MMM', { locale: enUS })
        : selectedPeriod === 'week'
          ? format(currentDate, 'EEE')
          : format(currentDate, 'd');
  
      const matchingActivities = selectedActivities.filter(activity => {
        const activityDate = new Date(activity.start_date_local);
        const formattedActivityDate = selectedPeriod === 'year'
          ? format(activityDate, 'MMM', { locale: enUS })
          : selectedPeriod === 'week'
            ? format(activityDate, 'EEE')
            : format(activityDate, 'd');
        return formattedActivityDate === formattedDate;
      });

      const time = matchingActivities.reduce((total, activity) => total + activity.moving_time, 0);
      const distance = matchingActivities.reduce((total, activity) => total + activity.distance, 0);
      firstChartData.push({ name: formattedDate, time: time, distance: distance});
    }
    setFirstChartData(firstChartData);
  };

  const getSecondChartData = (activities, period) => {
    let selectedActivities = [];
    let secondChartData = [];
    let rangeStart;
    let rangeDays;

    if (selectedPeriod === 'week') {
      selectedActivities = activities.filter(activity => {
        const weekStart = startOfWeek(new Date(activity.start_date_local), { weekStartsOn: 1 });
        const weekNumber = getISOWeek(weekStart);
        return weekNumber === selectedCompare;
      });
      rangeStart = getDateRange(selectedCompare);
      rangeDays = 7;
    } else if (period === 'month') {
      selectedActivities = activities.filter(activity => {
        const activityMonth = getMonth(new Date(activity.start_date_local)) + 1;
        return activityMonth === selectedCompare;
      });
      rangeStart = new Date(selectedYear, selectedCompare - 1, 1);
      rangeDays = new Date(selectedYear, selectedCompare, 0).getDate(); // Get number of days in the month
    } else if (period === 'year') {
      selectedActivities = activities.filter(activity => {
        const activityYear = getYear(new Date(activity.start_date_local));
        return activityYear === selectedCompare;
      });
      rangeStart = new Date(selectedCompare, 0, 1);
      rangeDays = 12; // Months in the year
    }
    for (let i = 0; i < rangeDays; i++) {
      const currentDate = period === 'year' 
        ? new Date(rangeStart.getFullYear(), rangeStart.getMonth() + i, 1)
        : new Date(rangeStart.getTime() + i * 24 * 60 * 60 * 1000);
  
      const formattedDate = period === 'year'
        ? format(currentDate, 'MMM', { locale: enUS })
        : period === 'week'
          ? format(currentDate, 'EEE')
          : format(currentDate, 'd');
  
      const matchingActivities = selectedActivities.filter(activity => {
        const activityDate = new Date(activity.start_date_local);
        const formattedActivityDate = period === 'year'
          ? format(activityDate, 'MMM', { locale: enUS })
          : period === 'week'
            ? format(activityDate, 'EEE')
            : format(activityDate, 'd');
        return formattedActivityDate === formattedDate;
      });

      const time = matchingActivities.reduce((total, activity) => total + activity.moving_time, 0);
      const distance = matchingActivities.reduce((total, activity) => total + activity.distance, 0);
      secondChartData.push({ name: formattedDate, time: time, distance: distance});
      
    }
    setSecondChartData(secondChartData);
  };


  // Units conversion
  const firstUnitConversion = firstChartData.map(data => ({
    ...data,
    distance: (data.distance * metersToMiles).toFixed(2),
    time: (data.time / 3600).toFixed(2),
  }));

  const secondUnitConversion = secondChartData.map(data => ({
    ...data,
    distance: (data.distance * metersToMiles).toFixed(2),
    time: (data.time / 3600).toFixed(2),
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>

    {/* Button */}
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

    {/* Ranking */}
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h6">First Ranking</Typography>
        {firstRankingLoading ? (
          <CircularProgress />
        ) : filteredActivities.length === 0 ? (
          <p>No records in this period</p>
        ) : (
          filteredActivities.map(activity => (
            <Paper key={activity._id}>
              <SportIcon sport={activity.sport} />
              <p>{activity.sport} - {(activity.distance * metersToMiles).toFixed(2)} miles - {activity.moving_time >= 86400 ? `${Math.floor(activity.moving_time / 86400)}:` : ''}{moment.utc(activity.moving_time*1000).format('HH:mm:ss')} total time</p>
            </Paper>
          ))
        )}
      </Grid>
      <Grid item xs={12} sm={6}>
        <Typography variant="h6">Second Ranking</Typography>
        {secondRankingLoading ? (
          <CircularProgress />
        ) : compareActivities.length === 0 ? (
          <Typography>No records in this period</Typography>
        ) : (
          compareActivities.map(activity => (
            <Paper key={activity._id}>
              <SportIcon sport={activity.sport} />
              <p>{activity.sport} - {(activity.distance * metersToMiles).toFixed(2)} miles - {activity.moving_time >= 86400 ? `${Math.floor(activity.moving_time / 86400)}:` : ''}{moment.utc(activity.moving_time*1000).format('HH:mm:ss')} total time</p>
            </Paper>
          ))
        )}
      </Grid>
    </Grid>

    {/* Chart */}
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <LineChart
          width={500}
          height={300}
          data={firstUnitConversion}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" domain={[0, 50]}/>
        <YAxis yAxisId="right" orientation="right" domain={[0, 50]}/>
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="time" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="right" type="monotone" dataKey="distance" stroke="#82ca9d" />
        </LineChart>
      </Grid>
          
      <Grid item xs={12} sm={6}>
        <LineChart
          width={500}
          height={300}
          data={secondUnitConversion}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" domain={[0, 50]}/>
        <YAxis yAxisId="right" orientation="right" domain={[0, 50]}/>
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="time" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="right" type="monotone" dataKey="distance" stroke="#82ca9d" />
        </LineChart>
      </Grid>
    </Grid>
    </div>
  );
};

export default ActivityChart;
