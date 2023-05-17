import React from 'react';
import moment from 'moment';
import { DataGrid, getGridNumericOperators } from '@mui/x-data-grid';
import { CircularProgress, Popover } from '@mui/material';
import ActivityCard from './activityCard';

export default function WorkoutGrid() {
  const user = localStorage.getItem('user');

  const [myActivities, setMyActivities] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedActivity, setSelectedActivity] = React.useState(null);
  const [anchorElActivityCard, setAnchorElActivityCard] = React.useState(null);

  const handleOpenActivityCard = (event, activity) => {
    if(activity.json && activity.json.name) setSelectedActivity(activity.json);
    else setSelectedActivity(activity);
    setAnchorElActivityCard(event.currentTarget);
  }
  const handleCloseActivityCard = () => setAnchorElActivityCard(null);

  const columns = [
    { field: 'name', headerName: 'Name', width: 300 },
    { field: 'sport', headerName: 'Sport', width: 150 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'start_date_local', headerName: 'Date', valueFormatter: params => (params.value.substring(0, 10)), width: 150 },
    { field: 'distance', headerName: 'Distance (mi)', width: 160,
      valueGetter: params => !params.value ? null : Number(parseFloat((params.value)/1609).toFixed(2)),
      filterOperators: getGridNumericOperators() },
    { field: 'moving_time', headerName: 'Time (min)', width: 100,
      valueGetter: params => !params.value ? null : moment.utc(params.value*1000).format('HH:mm:ss'),
      filterOperators: getGridNumericOperators() },
  ]

  // Initializes myActivities
  React.useEffect(() => {
    if(!myActivities){
      console.log('Loading activities');
      setIsLoading(true);
      fetch('http://localhost:3010/v0/activities?' + new URLSearchParams({username: user}), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          console.log(JSON.stringify(res));
          if (!res.ok) {
            console.log(`res is not ok`);
            throw res;
          }
          return res.json();
        })
        .then((res) => {
          if(res){
            console.log('Loaded activities');
            // Remove any duplicated activities
            let unique_activities = [];
            res.forEach((a) => {
              if(unique_activities.filter((b) => { return a.name === b.name && a.distance === b.distance && a.moving_time === b.moving_time }).length === 0) {
                unique_activities.push(a);
              }
            });
            res = unique_activities;

            localStorage.setItem('activities', JSON.stringify(res));
            res.forEach((a) => {
              a.distance = parseFloat(a.distance);
              a.moving_time = parseFloat(a.moving_time);
            });
            setMyActivities(res);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          alert(`Error retrieving activities for user ${user}`);
        });
    }
    else{
      setIsLoading(false);
    }
  }, [user, myActivities, isLoading]);

  // Updates localStorage whenever myActivities is updated
  React.useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(myActivities));
  }, [myActivities]);

  return (
    <>
    {
    isLoading ?
    <CircularProgress /> :

    <div style={{ height: 700, width: '100%' }}>

      <DataGrid
        rows={myActivities}
        getRowId={(row) => row._id}
        columns={columns}
        pageSize={100}
        onRowDoubleClick={(params, e) => handleOpenActivityCard(e, params.row) }
      />
      <Popover
        anchorEl={anchorElActivityCard}
        open={Boolean(anchorElActivityCard)}
        onClose={handleCloseActivityCard}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
      >
        <ActivityCard activity={selectedActivity} />
      </Popover>
    </div>
    }
  </>
  );
}
