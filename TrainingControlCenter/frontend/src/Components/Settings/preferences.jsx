import React from 'react';
import { Box, Button, Chip, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, Switch, Typography } from '@mui/material';
import ScaleIcon from '@mui/icons-material/Scale';
import MapIcon from '@mui/icons-material/Map';
import WebIcon from '@mui/icons-material/Web';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { red, orange, yellow, green, blue, purple, pink, grey, brown } from '@mui/material/colors';

function ColorChip({ color, isSmall=false }) {
  const myColors = {
    red: red[500],
    orange: orange[500],
    yellow: yellow[500],
    green: green[500],
    blue: blue[500],
    purple: purple[500],
    pink: pink[500],
    gray: grey[400],
    black: grey[900],
    brown: brown[500],
    magenta: purple['A400']
  }

  if(isSmall){
    return <Chip sx={{bgcolor: myColors[color], width: 15, height: 15}} label='&nbsp;&nbsp;' />
  }
  return <Chip size='small' sx={{bgcolor: myColors[color]}} label='&nbsp;&nbsp;' />
}

export default function Preferences({ colorTheme, setColorTheme, brightnessMode, setBrightnessMode }) {
  const [isMetric, setIsMetric] = React.useState(localStorage.getItem('isMetric') ? localStorage.getItem('isMetric') === 'true' : false);
  const [activityMapColor, setActivityMapColor] = React.useState(localStorage.getItem('activityMapColor') || 'red');
  const [activityMapMarkers, setActivityMapMarkers] = React.useState(localStorage.getItem('activityMapMarkers') ? localStorage.getItem('activityMapMarkers') === 'true' : true);

  React.useEffect(() => {
    localStorage.setItem('isMetric', isMetric);
  }, [isMetric]);

  React.useEffect(() => {
    localStorage.setItem('activityMapColor', activityMapColor);
  }, [activityMapColor]);

  React.useEffect(() => {
    localStorage.setItem('activityMapMarkers', activityMapMarkers);
  }, [activityMapMarkers]);

  React.useEffect(() => {
    localStorage.setItem('colorTheme', colorTheme);
  }, [colorTheme]);

  React.useEffect(() => {
    localStorage.setItem('brightnessMode', brightnessMode);
  }, [brightnessMode]);

  return (
    <>
      <List sx={{width: '100%'}}>
        <ListItem disablePadding dense>
          <ListItemButton>
            <ListItemIcon>
              <ScaleIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant='body1'>System of measurement</Typography>}
              secondary='This controls whether your distances are displayed in miles or meters'
            />
            <Select
              sx={{ml: '.5ch'}}
              size='small'
              defaultValue={isMetric ? 'Metric' : 'Imperial'}
              value={isMetric ? 'Metric' : 'Imperial'}
              onChange={ (e) => setIsMetric(e.target.value === 'Metric') }
            >
              <MenuItem value={'Imperial'}>Imperial</MenuItem>
              <MenuItem value={'Metric'}>Metric</MenuItem>
            </Select>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding dense>
          <ListItemButton>
            <ListItemIcon>
              <Brightness5Icon />
            </ListItemIcon>
            <ListItemText primary={<Typography variant='body1'>{brightnessMode.charAt(0).toUpperCase() + brightnessMode.slice(1)} Mode</Typography>} />
            <Button
              startIcon={brightnessMode === 'dark' ? <DarkModeIcon sx={{mr: '-1ch'}} /> : <WbSunnyIcon sx={{mr: '-1ch'}} />}
              variant='contained'
              onClick={() => {
                if(brightnessMode === 'light') {
                  setBrightnessMode('dark');
                }
                else {
                  setBrightnessMode('light');
                }
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding dense>
          <ListItemButton>
            <ListItemIcon>
              <WebIcon color={colorTheme} />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant='body1'>Color Theme</Typography>}
              secondary='This controls the colors of the website'
            />
            <Box sx={{ml: '.5ch'}}>
              <Select
                size='small'
                value={colorTheme}
                renderValue={(value) => {
                  return <ColorChip color={value} />
                }}
                onChange={ (e) => setColorTheme(e.target.value) }
              >
              {
                ['blue', 'purple', 'green', 'orange', 'red'].map((color) => (
                  <MenuItem key={color} value={color}><ColorChip color={color} /></MenuItem>
                ))
              }
              </Select>
            </Box>
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding dense>
          <ListItemButton>
            <ListItemIcon>
              <MapIcon />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant='body1'>Map settings</Typography>}
              secondary='This controls the map displayed for activities'
            />
            <Box sx={{ml: '.5ch'}}>
              <Box><Typography variant='caption'>Line color</Typography></Box>
              <Select
                size='small'
                value={activityMapColor}
                renderValue={(value) => {
                  return <ColorChip color={value} />
                }}
                onChange={ (e) => setActivityMapColor(e.target.value) }
              >
              { // // Red, orange, green, blue, purple, black, brown, magenta
                ['red', 'orange', 'green', 'blue', 'purple', 'black', 'brown', 'magenta'].map((color) => (
                  <MenuItem key={color} value={color}><ColorChip color={color} /></MenuItem>
                ))
              }
              </Select>
              <Box><Typography variant='caption'>Markers</Typography></Box>
              <Switch sx={{mt: '-1.2ch', ml: '-1ch'}} checked={activityMapMarkers} onChange={(e) => setActivityMapMarkers(e.target.checked)} />
            </Box>
          </ListItemButton>
        </ListItem>
      </List>
    </>
  )
}