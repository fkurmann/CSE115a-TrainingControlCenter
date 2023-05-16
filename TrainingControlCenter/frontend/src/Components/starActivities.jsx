import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const localStorageUser = localStorage.getItem('user');

const ActivityChart = () => {
  const [activity, setActivity] = useState('');
  const [activities, setActivities] = useState([]);
  const [days, setDays] = useState(14); // default to last 14 days
  
  // for test
  const [selectedDuration, setSelectedDuration] = useState('14D');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('http://localhost:3010/v0/activities?' 
        + new URLSearchParams({ username: localStorageUser }));

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const fetchedActivities = await response.json();
        setActivities(fetchedActivities);

      } catch (error) {
        console.error('An error occurred. Please try again.');
      }
    };

    fetchActivities();
  }, []);

  const handleActivityChange = (e) => {
    setActivity(e.target.value);
  };

  const handleDaysChange = (e) => {
    const value = e.target.value.slice(0, -1);
    const period = e.target.value.slice(-1);
  
    let days;
    switch(period) {
      case 'D':
        days = parseInt(value);
        break;
      case 'W':
        days = parseInt(value) * 7;
        break;
      case 'M':
        days = parseInt(value) * 30;
        break;
      default:
        days = 14; // default to last 14 days
    }
    setDays(days);
    setSelectedDuration(e.target.value);
  };  
  
  // temp for filter certain type
  // need to confirm which sport will be chosen
  const getActivityTypes = () => {
    const activityTypes = ["Ride", "Run"];
    return activityTypes;
  };
  
  // get dates from days ago to the current date
  const getDatesBetween = (days) => {
    const dates = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - days);

    while (currentDate < new Date()) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  const daysOptions = ['14D', '12W', '12M']; // options for number of days

  const filteredData = activities
  .filter(sport => sport.sport === activity)
  .map(sport => ({
    date: sport.start_date_local.split('T')[0],
    distance: sport.distance,
  }))
  .sort((a, b) => new Date(a.date) - new Date(b.date));

  // get all dates for the selected range
  const allDates = getDatesBetween(days);

  // Monday as first day of week
  const getWeeklyDistanceSum = (data) => {
    const distanceByWeek = {};
    
    // create an array of dates for the past 12 weeks
    const dates = getDatesBetween(84);
    
    dates.forEach(date => {
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Set to the start of the week
  
      const weekStartString = weekStart.toISOString().split('T')[0];
      if (!distanceByWeek[weekStartString]) {
        distanceByWeek[weekStartString] = 0;  // initialize to 0 for weeks without data
      }
    });
  
    data.forEach(item => {
      const weekStart = new Date(item.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // set to the start of the week
  
      const weekStartString = weekStart.toISOString().split('T')[0];
      distanceByWeek[weekStartString] += item.distance;
    });
  
    // Convert the object to an array of data points
    const weeklyData = Object.entries(distanceByWeek).map(([date, distance]) => ({
      date,
      distance,
    }));
  
    return weeklyData;
  };  

  // calculate the sum of the distances for each month
  const getMonthlyDistanceSum = (data) => {
    const distanceByMonth = data.reduce((acc, curr) => {
      const month = curr.date.slice(0, 7); // extract the year-month part
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += curr.distance;
      return acc;
    }, {});

    // convert the object to an array of data points
    const monthlyData = Object.entries(distanceByMonth).map(([date, distance]) => ({
      date,
      distance,
    }));

    return monthlyData;
  };

  // fill in missing dates
  const filledData = allDates.map(date => {
    const dateString = date.toISOString().split('T')[0];
    const foundItem = filteredData.find(item => item.date === dateString);

    return {
      date: dateString,
      distance: foundItem ? foundItem.distance : 0,
    };
  });

  // calculate the data for the chart
  let chartData;
  if (days === 360) {
    chartData = getMonthlyDistanceSum(filledData);
  } else if (days === 84) {
    chartData = getWeeklyDistanceSum(filledData);
  } else {
    chartData = filledData.slice(-days);
  }

  return (
    <div>
      <h2>Activity</h2>
      {/* Choose activity to filter */}
      <select value={activity} onChange={handleActivityChange}>
        <option value="">Choose</option>
        {getActivityTypes().map((activityType) => (
              <option key={activityType} value={activityType}>
                {activityType}
              </option>
            ))}
      </select>
          
      {/* Choose how many days */}
      <select value={days} onChange={handleDaysChange}>
        <option value="">Choose</option>
        {daysOptions.map((dayOption) => (
          <option key={dayOption} value={dayOption}>
            {dayOption[dayOption.length - 1] === 'D' ? `${dayOption.slice(0, -1)} days` : 
            dayOption[dayOption.length - 1] === 'W' ? `${dayOption.slice(0, -1)} weeks` : 
            `${dayOption.slice(0, -1)} months`}
          </option>
        ))}
      </select>

      {/* Display graph */}
      {filteredData.length > 0 && (
        <div>
          <h2>Graph</h2>
            <LineChart width={600} height={400} data={chartData}>
            <XAxis
              dataKey="date"
              tickFormatter={(value) => {
                if (days === 14 || days === 84) {
                  const [year, month, day] = value.split('-'); // split the date into month and day
                  return `${month}/${day}`; // format the date as "month/day"
                } else if (days === 360) {
                  const [year, month, day] = value.split('-');
                  return `${year}/${month}`;
                  // return value.slice(0, 7); // only show month and year
                } else {
                  return value;
                }
              }}                
            />
            <YAxis/>
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="distance" stroke="rgb(75, 192, 192)" />
            </LineChart>

            {/* For test: Display selected duration */}
            <div>Selected duration: {selectedDuration}</div>
        
        </div>
        
      )}
    </div>
  );
};

export default ActivityChart;