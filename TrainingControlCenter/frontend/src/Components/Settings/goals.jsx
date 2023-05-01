import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// TODO: Update icons, make all list items collapsable

export default function Goals() {
  const user = localStorage.getItem('user');
  const [open, setOpen] = React.useState([]);
  const [myGoals, setMyGoals] = React.useState(JSON.parse(localStorage.getItem('goals')));

  if(!localStorage.getItem('goals')){
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

  

  const handleClick = () => {
    
  };

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Filtered by Activity Type
        </ListSubheader>
      }
    >
      <ListItemButton>
        <ListItemIcon>
          <DirectionsRunIcon />
        </ListItemIcon>
        <ListItemText primary="Run" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <DirectionsBikeIcon />
        </ListItemIcon>
        <ListItemText primary="Cycle" />
      </ListItemButton>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <PoolIcon />
        </ListItemIcon>
        <ListItemText primary="Swim" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Swim 1" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}
