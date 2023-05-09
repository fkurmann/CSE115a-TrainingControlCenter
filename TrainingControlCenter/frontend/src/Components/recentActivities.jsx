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

// TODO: Update icons, make all list items collapsable, home screen will feature latest activities from 3 categories

export default function RecentActivitiesList() {
  const [open1, setOpen1] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);

  const handleClick1 = () => {
    setOpen1(!open1);
  };
  const handleClick2 = () => {
    setOpen2(!open2);
  };
  const handleClick3 = () => {
    setOpen3(!open3);
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
      {/* Category 1 */}
      <ListItemButton onClick={handleClick1}>
        <ListItemIcon>
          <DirectionsRunIcon /> 
        </ListItemIcon>
        <ListItemText primary="Run" />
        {open1 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={open1} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Swim 1" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Category 2 */}
      <ListItemButton onClick={handleClick2}>
        <ListItemIcon>
        <DirectionsBikeIcon />
        </ListItemIcon>
        <ListItemText primary="Swim" />
        {open2 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      
      <Collapse in={open2} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Swim 1" />
          </ListItemButton>
        </List>
      </Collapse>

      {/* Category 3 */}
      <ListItemButton onClick={handleClick3}>
        <ListItemIcon>
          <PoolIcon />
        </ListItemIcon>
        <ListItemText primary="Cycle" />
        {open3 ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      <Collapse in={open3} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemText primary="Swim 1" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  );
}