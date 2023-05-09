import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';
import SportsIcon from '@mui/icons-material/Sports';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function RecentActivitiesList() {
  const user = localStorage.getItem('user');
  const misc = 'Misc';
  
  const [openSport, setOpenSport] = React.useState([]);
  const [openActivity, setopenActivity] = React.useState([]);
  // const [myGoals, setMyGoals] = React.useState(localStorage.getItem('goals') === null ? [] : JSON.parse(localStorage.getItem('goals')));
  const [myFavorites, setMyFavorites] = React.useState([]);
  const [myActivities, setMyActivities] = React.useState([]);
  const [activitiesByCategory, setActivitiesByCategory] = React.useState({});
  const [activityCategories, setActivityCategories] = React.useState([]);
  const [anchorElActivity, setAnchorElActivity] = React.useState(null);

  
  const [isLoading, setIsLoading] = React.useState(true);

  let favorites = ['Running', 'Cycling', 'Swimming'];

// Get favorites from DB
React.useEffect(() => {
  if(!myFavorites || myFavorites.length === 0){
    console.log('Loading favorites');
    setIsLoading(true);
    fetch('http://localhost:3010/v0/favorites?' + new URLSearchParams({username: user}), {
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
        if(res.length > 0){
          localStorage.setItem('favorites', JSON.stringify(res));
          setMyFavorites(res);
          // setIsLoading(false);
        }
      })
      .catch((err) => {
        alert(`Error retrieving favorites for user ${user}`);
      });
  }
}, [user, myFavorites, isLoading]);

// Get activities from DB
React.useEffect(() => {
  if(!myFavorites || myFavorites.length === 0){
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
        if(res.length > 0){
          localStorage.setItem('activities', JSON.stringify(res));
          setMyActivities(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        alert(`Error retrieving activities for user ${user}`);
      });
  }
}, [user, myActivities, isLoading]);


// Not sure yet
React.useEffect(() => {
  console.log('useEffect() goal categories');
  if(myActivities){
    myActivities.forEach((activity) => {
      let temp = activitiesByCategory;
      let sport = activity.sport ? activity.sport : misc;
      if(!(sport in temp)){
        temp[sport] = [];
        setActivitiesByCategory(temp);
      }
      if(!temp[sport].find(a => a.name === activity.name)){
        temp[sport].push(activity);
        setActivitiesByCategory(temp);
      }
    });
    let activityCats = Object.keys(activitiesByCategory);
    if(activityCats.join(',') !== activityCategories.join(',')){
      setActivityCategories(activityCats);
    }
  }
}, [myActivities, activitiesByCategory, activityCategories]);

  const handleClickSport = (sport) => {
    if(openSport.includes(sport)){
      setOpenSport(openSport.filter((a) => a !== sport));
    }
    else{
      // setOpenSport([ ...open, sport]);
      setOpenSport([sport]);
    }
  }

  const handleClickActivity = (activityName) => {
    if(openActivity.includes(activityName)){
      setopenActivity(openActivity.filter((a) => a !== activityName));
    }
    else{
      setopenActivity([activityName]);
    }
  }

  const handleOpenActivityMenu = (event) => {
    setAnchorElActivity(event.currentTarget);
  }
  const handleCloseActivityMenu = (event) => {
    setAnchorElActivity(null);
  }

  return (
    <>
    {/* {
    isLoading ?
    <CircularProgress /> :
    <>
    <List sx={{ width: '100%', maxWidth: 500}}>
      {favorites.map((sport) => (
        <Box key={sport}>
        
        <ListItemButton selected={openSport.includes(sport)} onClick={() => handleClickSport(sport)}>
          <ListItemIcon>
            { sport === 'Running' ?
              <DirectionsRunIcon /> :
              sport === 'Cycling' ?
              <DirectionsBikeIcon /> :
              sport === 'Swimming' ?
              <PoolIcon /> :
              <SportsIcon />
            }
          </ListItemIcon>
          <ListItemText primary={sport} />
          {openSport.includes(sport) ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Divider variant="inset" component="li" />
        <Collapse in={openSport.includes(sport)} timeout="auto" unmountOnExit>
          <Grid container xsOffset={1}>
            <List component="div" disablePadding sx={{ width: '100%'}}>
              {activitiesByCategory[sport].map((activity) => (
                <Box key={activity.name}>
                  <ListItemButton selected={openActivity.includes(activity.name)} onClick={() => handleClickActivity(activity.name)}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary={activity.name} />
                    {openActivity.includes(activity.name) ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openActivity.includes(activity.name)} timeout="auto" unmountOnExit>
                      <Box sx={{ width: '100%', flexGrow: 0 }}>
                        <List component="div" disablePadding>
                          <ListItem secondaryAction={
                            <IconButton edge="end" aria-label="activity_settings" onClick={handleOpenActivityMenu}>
                              <MoreVertIcon />
                            </IconButton>
                          }>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText primary={activity.name} />
                            {activity.type ? <ListItemText primary={`type: ${activity.type}`} /> : <></>}
                            {activity.distance ? <ListItemText primary={`distance: ${activity.distance}`} /> : <></>}
                            {activity.time ? <ListItemText primary={`time: ${activity.time}`} /> : <></>}
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </List>
                      </Box>
                  </Collapse>
                </Box>
              ))}
            </List>
          </Grid>
        </Collapse>
        </Box>
      ))}
    </List>
    </>
    } */}
    </>
  );
}