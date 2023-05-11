import React, { useState, useEffect } from 'react'
import { DataGrid, getGridNumericOperators } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';

export default function WorkoutGrid() {
  const user = localStorage.getItem('user');

  const [myActivities, setMyActivities] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const columns = [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'sport', headerName: 'Sport', width: 150 },
    { field: 'type', headerName: 'Type', width: 150 },
    { field: 'start_date_local', headerName: 'Date', valueFormatter: params => (params.value), width: 150 },
    { field: 'distance', headerName: 'Distance', width: 75, 
      valueGetter: params => Number(parseFloat((params.value)/1609).toFixed(2)),
      filterOperators: getGridNumericOperators() },
    { field: 'moving_time', headerName: 'Time', width: 75,
      valueGetter: params => Number(parseFloat((params.value)/60).toFixed(2)),
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
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((res) => {
          if(res){
            console.log('Loaded activities');
            localStorage.setItem('activities', JSON.stringify(res));
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
      />
    </div>
    }
  </>
  );
}