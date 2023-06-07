import moment from 'moment';
import SportIcon from './sportIcon';
import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Typography, 
  Paper, 
  Button, 
  ButtonGroup, 
  Select, 
  MenuItem, 
  CircularProgress 
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { format, 
  getISOWeek, 
  getMonth, 
  getYear, 
  getDaysInMonth
} from 'date-fns';
import { enUS } from 'date-fns/locale'

const localStorageUser = localStorage.getItem('user');

const ActivityChart = () => {
  const isMetric = localStorage.getItem('isMetric') ? localStorage.getItem('isMetric') === 'true' : false;
  const dist_unit = isMetric ? 'kilometers' : 'miles';
  const meters_per_unit = isMetric ? 1000 : 1609.34;
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [selectedCompare, setSelectedCompare] = useState(getCurrentWeek());
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [compareActivities, setCompareActivities] = useState([]);
  const [firstRankingLoading, setFirstRankingLoading] = useState(false);
  const [secondRankingLoading, setSecondRankingLoading] = useState(false);
  const [firstChartData, setFirstChartData] = useState([]);
  const [secondChartData, setSecondChartData] = useState([]);
  const metersToMiles = 0.000621371;

  /**
   * Returns the current week in ISO format.
   *
   * @return {int} - ISO week of current date
   */
  function getCurrentWeek() {
    const currentDate = new Date();
    const currentWeek = getISOWeek(currentDate);
    return currentWeek;
  }

  /**
   * Returns the current month in ISO format.
   *
   * @return {int} - ISO month of current date
   */
  function getCurrentMonth() {
    const currentDate = new Date();
    const currentMonth = getMonth(currentDate) + 1;
    return currentMonth;
  }

  /**
   * Returns the current year in ISO format.
   *
   * @return {int} - ISO year of current date
   */
  function getCurrentYear() {
    const currentYear = new Date().getFullYear();
    return currentYear;
  }

  /**
   * Returns the starting date of some given week.
   *
   * @param {int} weekNumber - Represents the current selected week.
   * @return {int} - Returns the starting date of selected week.
   */
  function getDateRange(weekNumber) {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysPerWeek = 7;

    // Subtract 1 because weekNumber is 1-based
    const weekStart = new Date(startOfYear.getTime() + ((weekNumber - 1) * daysPerWeek * millisecondsPerDay));

    return weekStart;
  }

  /**
   * Returns the ending date of some given week.
   *
   * @param {int} weekNumber - Represents the current selected week.
   * @return {int} - Returns the ending date of selected week.
   */
  function getEndDate(weekNumber) {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysPerWeek = 7;

    // Subtract 1 because weekNumber is 1-based
    const weekEnd = new Date(startOfYear.getTime() + (weekNumber * daysPerWeek * millisecondsPerDay) - millisecondsPerDay);

    return weekEnd;
  }

  /**
   * Returns time formatted as {days}d {hours}:{mins}:{secs}
   *
   * @param {int} secs - Number of seconds.
   * @return {int} - Returns the formatted time. 599 -> '9:59', 7200 -> '2:00:00', 86400 -> '1d 00:00:00'
   */
  function secondsToDigital(secs) {
    let format = '';
    if(secs / 60 < 10) format = 'm:ss';
    else if(secs / 3600 < 1) format = 'mm:ss';
    else if(secs / 3600 < 10) format = 'H:mm:ss';
    else if(secs / 86400 < 1) format = 'HH:mm:ss';
    else return Math.floor(secs / 86400) + 'd ' + moment.utc(secs*1000).format('HH:mm:ss');
    return moment.utc(secs*1000).format(format);
  }

  /**
   * Defines the mapping of sports to their normalized names.
   * Used to group similar sports together.
   */
  const sportMappings = {
    Running: ["Running", "Run", "Virtual Run"],
    Hiking: ["Hiking", "Hike"],
    Walking: ["Walking", "Walk"],
    Swimming: ["Swimming", "Swim"],
    WeightTraining: ["Weight Training"],
    Workout: ["Workout"],
    Rowing: ["Rowing", "Row"],
    Skiing: ["Skiing", "Ski"],
    Riding: ["Riding", "Ride", "Virtual Ride"]
  };

  /**
   * Fetches data for first graph comparison.
   *
   * @async
   */
  const fetchDataForFirstRanking = async () => {
    try {
      setFirstRankingLoading(true);
      const response = await fetch(`http://localhost:3010/v0/activities?username=${localStorageUser}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fetchedActivities = await response.json();
      let seenTimes = new Set();

      const activitiesWithUniqueTime = fetchedActivities.filter(activity => {
        if (activity.moving_time > 0 && !seenTimes.has(activity.start_date_local)) {
          seenTimes.add(activity.start_date_local);
          return true;
        }
        return false;
      });

      // First, filter and sort activities by selectedPeriod
      const filteredAndSorted = activitiesWithUniqueTime
      .filter((activity) => {
        let activityDate = new Date(activity.start_date_local);

        // Reset the time to midnight
        activityDate.setHours(0, 0, 0, 0);

        if (selectedPeriod === 'week') {
          let weekStart = getDateRange(selectedWeek);
          let weekEnd = getEndDate(selectedWeek);

          // Reset the time to midnight
          weekStart.setHours(0, 0, 0, 0);
          weekEnd.setHours(0, 0, 0, 0);

          return activityDate >= weekStart && activityDate <= weekEnd;
        } else if (selectedPeriod === 'month') {
          return getMonth(activityDate) + 1 === selectedMonth && getYear(activityDate) === getCurrentYear();
        } else if (selectedPeriod === 'year') {
          return getYear(activityDate) === selectedYear;
        }
        return true;
      })
      // Sort activities by start date
      .sort((a, b) => new Date(b.start_date_local) - new Date(a.start_date_local));

      // Ranking: sum up the moving_time and distance for the same type of activities
      const activitySum = filteredAndSorted.reduce((prev, curr) => {
        // Normalize the sport names
        const normalizedSport = curr.sport.toLowerCase().trim();

        // Find the matching normalized sport name in the mappings
        const matchedSport = Object.entries(sportMappings).find(([sport, aliases]) =>
          aliases.some(alias => normalizedSport === alias.toLowerCase())
        );

        if (matchedSport) {
          const [sportName] = matchedSport;
          if (!prev[sportName]) {
            prev[sportName] = { ...curr, sport: sportName };
          } else {
            prev[sportName].distance += curr.distance;
            prev[sportName].moving_time += Number(curr.moving_time);
          }
        } else {
          // For other sports, keep them as they are
          if (!prev[curr.sport]) {
            prev[curr.sport] = { ...curr };
          } else {
            prev[curr.sport].distance += curr.distance;
            prev[curr.sport].moving_time += Number(curr.moving_time);
          }
        }

        return prev;
      }, {});

      const activitySumArray = Object.values(activitySum);
      const periodSumArray = Object.values(filteredAndSorted);

      // if (activitySumArray.length === 0 &&  periodSumArray.periodSumArray) {
      //   setNoRecords(true);
      // } else {
      //   setNoRecords(false);
      // }

      setFilteredActivities(activitySumArray);
      getFirstChartData(periodSumArray, selectedPeriod);
      setFirstRankingLoading(false);
    } catch (error) {
      setFirstRankingLoading(false);
      console.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    fetchDataForFirstRanking();
  // eslint-disable-next-line
  }, [selectedPeriod, selectedWeek, selectedMonth, selectedYear]);

  /**
   * Fetches data for the second graph comparison.
   *
   * @async
   */
  const fetchDataForSecondRanking = async () => {
    try {
      setSecondRankingLoading(true);
      const response = await fetch(`http://localhost:3010/v0/activities?username=${localStorageUser}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const fetchedActivities = await response.json();
      let seenTimes = new Set();

      const activitiesWithUniqueTime = fetchedActivities.filter(activity => {
        if (activity.moving_time > 0 && !seenTimes.has(activity.start_date_local)) {
          seenTimes.add(activity.start_date_local);
          return true;
        }
        return false;
      });

      // First, filter and sort activities by selectedCompare
      const filteredAndSorted = activitiesWithUniqueTime
        .filter((activity) => {
          let activityDate = new Date(activity.start_date_local);

          // Reset the time to midnight
          activityDate.setHours(0, 0, 0, 0);

          if (selectedPeriod === 'week') {
            let weekStart = getDateRange(selectedCompare);
            let weekEnd = getEndDate(selectedCompare);

            // Reset the time to midnight
            weekStart.setHours(0, 0, 0, 0);
            weekEnd.setHours(0, 0, 0, 0);

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
        // Normalize the sport names
        const normalizedSport = curr.sport.toLowerCase().trim();

        // Find the matching normalized sport name in the mappings
        const matchedSport = Object.entries(sportMappings).find(([sport, aliases]) =>
          aliases.some(alias => normalizedSport === alias.toLowerCase())
        );

        if (matchedSport) {
          const [sportName] = matchedSport;
          if (!prev[sportName]) {
            prev[sportName] = { ...curr, sport: sportName };
          } else {
            prev[sportName].distance += curr.distance;
            prev[sportName].moving_time += Number(curr.moving_time);
          }
        } else {
          // For other sports, keep them as they are
          if (!prev[curr.sport]) {
            prev[curr.sport] = { ...curr };
          } else {
            prev[curr.sport].distance += curr.distance;
            prev[curr.sport].moving_time += Number(curr.moving_time);
          }
        }

        return prev;
      }, {});

      const activitySumArray = Object.values(activitySum);
      const periodSumArray = Object.values(filteredAndSorted);

      setCompareActivities(activitySumArray);
      getSecondChartData(periodSumArray, selectedPeriod);
      setSecondRankingLoading(false);
    } catch (error) {
      setSecondRankingLoading(false);
      console.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    fetchDataForSecondRanking();
  // eslint-disable-next-line
  }, [selectedPeriod, selectedCompare]);

  /**
   * Handles the change of the selected period.
   *
   * @param {string} period - Represents the selected period ('month', 'week', or 'year').
   * @returns {Promise<void>} - A Promise that resolves after updating the selected period and related state.
   */
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

  /**
   * Handles the change of the selected week.
   *
   * @param {Object} event - The event object triggered by the week selection.
   * @returns {void} - Returns nothing.
   */
  // eslint-disable-next-line
  const handleWeekChange = (event) => {
    const selectedWeek = event.target.value;
    setSelectedWeek(selectedWeek);
  };

  /**
   * Handles the change of the selected month.
   *
   * @param {Object} event - The event object triggered by the month selection.
   * @returns {void} - Returns nothing.
   */
  // eslint-disable-next-line
  const handleMonthChange = (event) => {
    const value = event.target.value;
    setSelectedMonth(value);
  };

  /**
   * Handles the change of the selected year.
   *
   * @param {Object} event - The event object triggered by the year selection.
   * @returns {void} - Returns nothing.
   */
  // eslint-disable-next-line
  const handleYearChange = (event) => {
    const value = event.target.value;
    setSelectedYear(value);
  };

  /**
   * Handles the change of the selected comparison value.
   *
   * @param {Object} event - The event object triggered by the comparison selection.
   * @returns {void} - Returns nothing.
   */
  const handleCompareChange = (event) => {
    if (selectedPeriod === 'week') {
      setSelectedCompare(event.target.value);
    } else if (selectedPeriod === 'month') {
      setSelectedCompare(event.target.value);
    } else if (selectedPeriod === 'year') {
      setSelectedCompare(event.target.value);
    }
  };

  /**
   * Retrieves the data for the first chart based on the selected period.
   *
   * @param {Array} activities - The activities data to be processed.
   * @param {string} period - The selected period ('week', 'month', or 'year').
   * @returns {void} - Returns nothing.
   */
  const getFirstChartData = (activities, period) => {
    let firstChartData = [];

    if (period === 'week') {
      // Initialize a week's data
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      firstChartData = days.map(day => ({ name: day, time: 0, distance: 0 }));

      activities.forEach(activity => {
        const activityDate = new Date(activity.start_date_local);
        const dayOfWeek = activityDate.getUTCDay();
        firstChartData[dayOfWeek].time += activity.moving_time;
        firstChartData[dayOfWeek].distance += activity.distance;
      });
    } else if (period === 'month') {
      // Initialize a month's data
      const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth - 1));
      firstChartData = Array.from({length: daysInMonth}, (_, i) => ({ name: i + 1, time: 0, distance: 0 }));

      activities.forEach(activity => {
        const activityDate = new Date(activity.start_date_local);
        const dayOfMonth = activityDate.getUTCDate() - 1;
        firstChartData[dayOfMonth].time += activity.moving_time;
        firstChartData[dayOfMonth].distance += activity.distance;
      });
    } else if (period === 'year') {
      // Initialize a year's data
      firstChartData = Array.from({length: 12}, (_, i) => ({ name: format(new Date(selectedYear, i), 'MMM', { locale: enUS }), time: 0, distance: 0 }));

      activities.forEach(activity => {
        const activityDate = new Date(activity.start_date_local);
        const month = activityDate.getUTCMonth();
        firstChartData[month].time += activity.moving_time;
        firstChartData[month].distance += activity.distance;
      });
    }
    setFirstChartData(firstChartData);
  };

  /**
   * Retrieves the data for the second chart based on the selected period.
   *
   * @param {Array} activities - The activities data to be processed.
   * @param {string} period - The selected period ('week', 'month', or 'year').
   * @returns {void} - Returns nothing.
   */
  const getSecondChartData = (activities, period) => {
    let secondChartData = [];

    if (period === 'week') {
      // Initialize a week's data
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      secondChartData = days.map(day => ({ name: day, time: 0, distance: 0 }));

      activities.forEach(activity => {
        const activityDate = new Date(activity.start_date_local);
        const dayOfWeek = activityDate.getUTCDay();
        secondChartData[dayOfWeek].time += activity.moving_time;
        secondChartData[dayOfWeek].distance += activity.distance;
      });
    } else if (period === 'month') {
      // Initialize a month's data
      const daysInMonth = getDaysInMonth(new Date(selectedYear, selectedMonth - 1));
      secondChartData = Array.from({length: daysInMonth}, (_, i) => ({ name: i + 1, time: 0, distance: 0 }));

      activities.forEach(activity => {
        const activityDate = new Date(activity.start_date_local);
        const dayOfMonth = activityDate.getUTCDate() - 1;
        secondChartData[dayOfMonth].time += activity.moving_time;
        secondChartData[dayOfMonth].distance += activity.distance;
      });
    } else if (period === 'year') {
      // Initialize a year's data
      secondChartData = Array.from({length: 12}, (_, i) => ({ name: format(new Date(selectedYear, i), 'MMM', { locale: enUS }), time: 0, distance: 0 }));

      activities.forEach(activity => {
        const activityDate = new Date(activity.start_date_local);
        const month = activityDate.getUTCMonth();
        secondChartData[month].time += activity.moving_time;
        secondChartData[month].distance += activity.distance;
      });
    }
    setSecondChartData(secondChartData);
  };

  /**
   * Performs units conversion for the first chart data.
   *
   * @param {Array} firstChartData - The first chart data to be processed.
   * @returns {Array} - The processed first chart data with converted units.
   */
  const firstUnitConversion = firstChartData.map(data => ({
    ...data,
    distance: (data.distance * metersToMiles).toFixed(2),
  }));

  /**
   * Performs units conversion for the second chart data.
   *
   * @param {Array} secondChartData - The second chart data to be processed.
   * @returns {Array} - The processed second chart data with converted units.
   */
  const secondUnitConversoin = secondChartData.map(data => ({
    ...data,
    distance: (data.distance * metersToMiles).toFixed(2),
  }));

  /**
   * Calculate the maximum distance values
   */
  const firstMaxDistance = Math.max(...firstUnitConversion.map(data => data.distance));
  const secondMaxDistance = Math.max(...secondUnitConversoin.map(data => data.distance));

  /**
   * Calculate the maximum time values
   */
  const firstMaxTime = Math.max(...firstUnitConversion.map(data => data.time));
  const secondMaxTime = Math.max(...secondUnitConversoin.map(data => data.time));

  /**
   * Custom tooltip component for the chart.
   *
   * @param {Object} props - The props passed to the component.
   * @param {boolean} props.active - Indicates if the tooltip is active.
   * @param {Array} props.payload - The payload of the tooltip.
   * @returns {JSX.Element|null} - The rendered tooltip component.
   */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      // eslint-disable-next-line
      const { name, time, distance } = payload[0].payload;

      const formattedTime =
        time >= 86400
          ? `${Math.floor(time / 86400)}:${moment.utc(time * 1000).format('HH:mm:ss')}`
          : moment.utc(time * 1000).format('HH:mm:ss');

      return (
        <div
          style={{
            background: 'white',
            border: '1px solid gray',
            borderRadius: '4px',
            padding: '8px',
            fontSize: '12px',
          }}
        >
          <div style={{ marginBottom: '4px' }}>{`Distance: ${distance} mi`}</div>
          <div style={{ marginBottom: '4px' }}>{`Time: ${formattedTime} total time`}</div>
        </div>
      );
    }

    return null;
  };

  /**
   * Formats the given time in seconds into a string representation of days, hours, minutes, and seconds.
   *
   * @param {number} seconds - The time in seconds.
   * @returns {string} - The formatted time string in the format "days:hours:minutes:seconds".
   */
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${days}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
              <p>{activity.sport} - {(activity.distance / meters_per_unit).toFixed(2)} {dist_unit} - {secondsToDigital(activity.moving_time)} total time</p>
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
              <p>{activity.sport} - {(activity.distance / meters_per_unit).toFixed(2)} {dist_unit} - {secondsToDigital(activity.moving_time)} total time</p>
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
        <YAxis yAxisId="left"
               domain={[0, firstMaxTime + 1]}
               label={{ value: 'Time', angle: -90, position: 'insideRight' }}
               tickFormatter={formatTime}
        />
        <YAxis yAxisId="right"
               orientation="right"
               domain={[0, firstMaxDistance + 1]}
               label={{ value: 'Distance', angle: -90, position: 'insideRight' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="time" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line yAxisId="right" type="monotone" dataKey="distance" stroke="#82ca9d" />
        </LineChart>
      </Grid>

      <Grid item xs={12} sm={6}>
        <LineChart
          width={500}
          height={300}
          data={secondUnitConversoin}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left"
               domain={[0, secondMaxTime + 1]}
               label={{ value: 'Time', angle: -90, position: 'insideRight' }}
               tickFormatter={formatTime}
               />
        <YAxis yAxisId="right"
               orientation="right"
               domain={[0, secondMaxDistance + 1]}
               label={{ value: 'Distance', angle: -90, position: 'insideRight' }}
               />
        <Tooltip content={<CustomTooltip />} />
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
