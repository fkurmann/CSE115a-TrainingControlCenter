import React from 'react';
import { 
  Box, 
  Button, 
  Chip, List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  MenuItem, 
  Select, 
  Switch, 
  Typography 
} from '@mui/material';
import ScaleIcon from '@mui/icons-material/Scale';
import MapIcon from '@mui/icons-material/Map';
import WebIcon from '@mui/icons-material/Web';
import Brightness5Icon from '@mui/icons-material/Brightness5';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { 
  red, 
  orange, 
  yellow, 
  green, 
  blue, 
  purple, 
  pink, 
  grey, 
  brown 
} from '@mui/material/colors';

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

/**
 * Assigns user preferences such as color scheme and units of measurements.
 */
export default function Preferences({ colorTheme, setColorTheme, brightnessMode, setBrightnessMode }) {
  const user = localStorage.getItem('user');
  const [isMetric, setIsMetric] = React.useState(localStorage.getItem('isMetric') ? localStorage.getItem('isMetric') === 'true' : null);
  const [activityMapColor, setActivityMapColor] = React.useState(localStorage.getItem('activityMapColor') || 'red');
  const [activityMapMarkers, setActivityMapMarkers] = React.useState(localStorage.getItem('activityMapMarkers') ? localStorage.getItem('activityMapMarkers') === 'true' : false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [inQueue, setInQueue] = React.useState([]);
  const [isUpdating, setIsUpdating] = React.useState([]);
  const [updatePreference, setUpdatePreference] = React.useState({username: user});

  React.useEffect(() => {
    if (isMetric == null && !isLoading) {
      console.log('Loading preferences');
      setIsLoading(true);
      fetch('http://localhost:3010/v0/preferences?' + new URLSearchParams({username: user}), {
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
          setIsLoading(false);
          console.log('Loaded preferences', res);
          setIsMetric(res.isMetric || false);
          setColorTheme(res.colorTheme || 'blue');
          setBrightnessMode(res.brightnessMode || 'light');
          setActivityMapColor(res.activityMapColor || 'red');
          setActivityMapMarkers(res.activityMapMarkers || false);
        })
        .catch((err) => {
          setIsLoading(false);
          alert(`Error retrieving preferences for user ${user}`);
        });
    }
  }, [isMetric, activityMapColor, activityMapMarkers, setColorTheme, setBrightnessMode, isLoading, user]);

  React.useEffect(() => {
    if (Object.keys(updatePreference).length === 1 || isUpdating.length > 0) {
      return;
    }
    const body = updatePreference;
    // console.log(`Updating preferences: ${JSON.stringify(body)}`);
    Object.keys(body).forEach((field) => {
      if (field !== 'username') {
        setIsUpdating([...isUpdating, field]);
        setInQueue(inQueue.filter((f) => f !== field));
      }
    });
    setUpdatePreference({username: user});
    fetch('http://localhost:3010/v0/preferences', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        Object.keys(body).forEach((field) => {
          if (field !== 'username') {
            localStorage.setItem(field, body[field]);
            setIsUpdating(isUpdating.filter((f) => f !== field));
          }
        });
        console.log(`Updated preferences`);
      })
      .catch((err) => {
        Object.keys(body).forEach((field) => {
          if (field !== 'username') {
            setIsUpdating(isUpdating.filter((f) => f !== field));
          }
        });
        console.error('Error when toggling preferences');
      });

  }, [updatePreference, isUpdating, inQueue, user]);

  React.useEffect(() => {
    const cur = localStorage.getItem('isMetric') ? localStorage.getItem('isMetric') === 'true' : null;
    if (isMetric == null || cur === isMetric) {
      return;
    }
    localStorage.setItem('isMetric', isMetric);
    if (!inQueue.includes('isMetric')) {
      setInQueue([...inQueue, 'isMetric']);
    }
    setUpdatePreference({...updatePreference, isMetric: isMetric});
  }, [isMetric, inQueue, updatePreference]);

  React.useEffect(() => {
    if (activityMapColor === localStorage.getItem('activityMapColor')) {
      return;
    }
    localStorage.setItem('activityMapColor', activityMapColor);
    if (!inQueue.includes('activityMapColor')) {
      setInQueue([...inQueue, 'activityMapColor']);
    }
    setUpdatePreference({...updatePreference, activityMapColor: activityMapColor});
  }, [activityMapColor, inQueue, updatePreference]);

  React.useEffect(() => {
    const cur = localStorage.getItem('activityMapMarkers') ? localStorage.getItem('activityMapMarkers') === 'true' : null;
    if (cur === activityMapMarkers) {
      return;
    }
    localStorage.setItem('activityMapMarkers', activityMapMarkers);
    if (!inQueue.includes('activityMapMarkers')) {
      setInQueue([...inQueue, 'activityMapMarkers']);
    }
    setUpdatePreference({...updatePreference, activityMapMarkers: activityMapMarkers});
  }, [activityMapMarkers, inQueue, updatePreference]);

  React.useEffect(() => {
    if (colorTheme === localStorage.getItem('colorTheme')) {
      return;
    }
    localStorage.setItem('colorTheme', colorTheme);
    if (!inQueue.includes('colorTheme')) {
      setInQueue([...inQueue, 'colorTheme']);
    }
    setUpdatePreference({...updatePreference, colorTheme: colorTheme});
  }, [colorTheme, inQueue, updatePreference]);

  React.useEffect(() => {
    if (brightnessMode === localStorage.getItem('brightnessMode')) {
      return;
    }
    localStorage.setItem('brightnessMode', brightnessMode);
    if (!inQueue.includes('brightnessMode')) {
      setInQueue([...inQueue, 'brightnessMode']);
    }
    setUpdatePreference({...updatePreference, brightnessMode: brightnessMode});
  }, [brightnessMode, inQueue, updatePreference]);

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
              {
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
