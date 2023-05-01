import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';
import SportsIcon from '@mui/icons-material/Sports';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { ListActionTypes } from '@mui/base/useList';

const goal1 = {username: 'dan4', name: 'Goal1', sport: 'running', distance: 5000, time: 1200};
const goal2 = {username: 'dan4', name: 'Goal2', sport: 'running', distance: 1600, time: 300};
const goal3 = {username: 'dan4', name: 'Goal3', sport: 'cycling'};
const goal4 = {username: 'dan4', name: 'Goal4'};
const goals = [goal1, goal2, goal3, goal4];

export default function Goals() {
  const user = localStorage.getItem('user');
  const [open, setOpen] = React.useState([]);
  // const [myGoals, setMyGoals] = React.useState(JSON.parse(localStorage.getItem('goals')));
  const [myGoals, setMyGoals] = React.useState(goals);
  const [goalsByCategory, setGoalsByCategory] = React.useState({});
  const [goalCategories, setGoalCategories] = React.useState([]);

  React.useEffect(() => {
    if(!myGoals){
      console.log('Loading goals');
      /*
      fetch('http://localhost:3010/v0/goals?' + new URLSearchParams({username: user}), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          localStorage.setItem('goals', res.text());
          setMyGoals(res.text().split(/\r|\n/));
        })
        .catch((err) => {
          alert(`Error retrieving goals for user ${user}`);
        });
      */
    }
  });

  React.useEffect(() => {
    console.log('useEffect() goal categories')
    myGoals.forEach((goal) => {
      let temp = goalsByCategory;
      let sport = goal.sport ? goal.sport : 'misc';
      if(!(sport in temp)){
        temp[sport] = [];
        setGoalsByCategory(temp);
      }
      if(!((temp[sport].find(g => g.name === goal.name)))){
        temp[sport].push(goal);
        setGoalsByCategory(temp);
      }
    });
    let goalCats = Object.keys(goalsByCategory);
    if(goalCats.join(',') !== goalCategories.join(',')){
      setGoalCategories(goalCats);
    }
  }, [myGoals, goalsByCategory, goalCategories]);
  
  const handleClick = (sport) => {
    if(open.includes(sport)){
      setOpen(open.filter((openSport) => openSport !== sport));
    }
    else{
      setOpen([ ...open, sport]);
    }
  }

  return (
    <>
    <List sx={{ width: '100%', maxWidth: 333}}>
      {goalCategories.map((sport) => (
        <div key={sport}>
        <ListItemButton selected={open.includes(sport)} onClick={() => handleClick(sport)}>
          <ListItemIcon>
            { sport === 'running' ?
              <DirectionsRunIcon /> :
              sport === 'cycling' ?
              <DirectionsBikeIcon /> :
              sport === 'swimming' ?
              <PoolIcon /> :
              <SportsIcon />
            }
          </ListItemIcon>
          <ListItemText primary={sport} />
          {open.includes(sport) ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Divider />
        <Collapse in={open.includes(sport)} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {goalsByCategory[sport].map((goal) => (
              <div key={goal.name}>
              <ListItem key={goal.name} secondaryAction={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }>
                <ListItemText primary={goal.name} />
              </ListItem>
              </div>
            ))}
          </List>
        </Collapse>
        </div>
      ))}
    </List>
    </>
  );
}
