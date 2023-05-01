import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';

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
    myGoals.forEach((goal) => {
      if(goal.sport && !goalCategories.includes(goal.sport)){
        // myGoalCategories.push(goal.sport);
        setGoalCategories([ ...goalCategories, goal.sport]);
      }
      else if(!goal.sport && !goalCategories.includes('misc')){
        // myGoalCategories.push('misc');
        setGoalCategories([ ...goalCategories, 'misc']);
      }
    });
  });

  const handleClick = (sport) => {
    open.push(sport);
  }

  return (
    <>
    <List sx={{ width: '100%', maxWidth: 333}}>
      {goalCategories.map((sport) => (
        <div key={sport}>
        <ListItemButton onClick={handleClick(sport)}>
          <ListItemIcon>
            <DirectionsBikeIcon />
          </ListItemIcon>
          <ListItemText primary={sport} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Divider />
        </div>
      ))}
    </List>
    </>
  );
}
