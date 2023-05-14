import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Select, MenuItem } from '@mui/material';
import { format, getISOWeek, startOfWeek, endOfWeek, getMonth, getYear } from 'date-fns';
import { enUS } from 'date-fns/locale'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const localStorageUser = localStorage.getItem('user');

const ActivityChart = () => {
  const [activities, setActivities] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [chartData, setChartData] = useState([]);
  const [weekRange, setWeekRange] = useState('');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
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

        setActivities(activitySumArray);
      } catch (error) {
        console.error('An error occurred. Please try again.');
      }
    };

    fetchActivities();
  }, []);

  useEffect(() => {
    const generateChartData = () => {
      let selectedActivities = [];
      let chartData = [];
      let rangeStart;
      let rangeDays;
  
      if (selectedPeriod === 'week') {
        selectedActivities = activities.filter(activity => {
          const weekStart = startOfWeek(new Date(activity.start_date_local), { weekStartsOn: 1 });
          const weekNumber = getISOWeek(weekStart);
          return weekNumber === selectedWeek;
        });
        rangeStart = getDateRange(selectedWeek);
        rangeDays = 7;
      } else if (selectedPeriod === 'month') {
        selectedActivities = activities.filter(activity => {
          const activityMonth = getMonth(new Date(activity.start_date_local)) + 1;
          return activityMonth === selectedMonth;
        });
        rangeStart = new Date(selectedYear, selectedMonth - 1, 1);
        rangeDays = new Date(selectedYear, selectedMonth, 0).getDate(); // Get number of days in the month
      }
  
      if (selectedPeriod === 'year') {
        selectedActivities = activities.filter(activity => {
          const activityYear = getYear(new Date(activity.start_date_local));
          return activityYear === selectedYear;
        });
        rangeStart = new Date(selectedYear, 0, 1);
        rangeDays = 12; // Months in the year
      }
  
      for (let i = 0; i < rangeDays; i++) {
        if (selectedPeriod === 'year') {
          const currentMonth = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + i, 1);
          const formattedMonth = format(currentMonth, 'MMM', { locale: enUS });
        
          const matchingActivities = selectedActivities.filter(activity => {
            const activityDate = new Date(activity.start_date_local);
            return format(activityDate, 'MMM', { locale: enUS }) === formattedMonth;
          });
        
          const time = matchingActivities.reduce((total, activity) => total + activity.moving_time, 0);
        
          chartData.push({ name: formattedMonth, time: time });
        } else {
          const currentDay = new Date(rangeStart.getTime() + i * 24 * 60 * 60 * 1000);
          const formattedDay = format(currentDay, 'MM/dd');
  
          const matchingActivity = selectedActivities.find(activity => {
            const activityDate = new Date(activity.start_date_local);
            return format(activityDate, 'MM/dd') === formattedDay;
          });
  
          const time = matchingActivity ? matchingActivity.moving_time : 0;
  
          chartData.push({ name: formattedDay, time: time });
        }
      }
  
      setChartData(chartData);
    };
    generateChartData();
  }, [activities, selectedWeek, selectedMonth, selectedPeriod, selectedYear]);
  
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  
    if (period === 'month') {
      setSelectedMonth(getCurrentMonth());
    } else if (period === 'week') {
      setSelectedWeek(getCurrentWeek());
    } else if (period === 'year') {
      setSelectedYear(getCurrentYear());
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
        <div style={{ width: 200, margin: '20px auto' }}>
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
        </div>
      )}

      {/* Place chart code here */}
      <div style={{ marginTop: '20px' }}>
      <div style={{ marginTop: '10px', fontSize: '14px' }}>{weekRange}</div>

        <LineChart width={500} height={400} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {chartData.length > 0 ? (
            <Line type="monotone" dataKey="time" stroke="#8884d8" />
          ) : (
            <Line type="monotone" dataKey="time" stroke="#8884d8" connectNulls={true} />
          )}
        </LineChart>
      </div>
    </div>
  );
};

export default ActivityChart;
