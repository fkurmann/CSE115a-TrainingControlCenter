import * as React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Typography, 
  Box,
  Grid 
} from '@mui/material';
import ResponsiveAppBar from '../Components/appBar';
import Favorites from '../Components/Settings/favorites';
import Goals from '../Components/Settings/goals';
import Preferences from '../Components/Settings/preferences';

/**
 * The settings page where goals, favorites, other feature are set.
 *
 * @return {HTMLElement} - Creates the page with goals, favorites, and units elements.
 */
export default function Settings() {
  const [colorTheme, setColorTheme] = React.useState(localStorage.getItem('colorTheme') || 'blue');
  const [brightnessMode, setBrightnessMode] = React.useState(localStorage.getItem('brightnessMode') || 'light');

  /**
  * Create the theme to be used
  */
  const [myColors] = React.useState({
    blue: 'rgb(25, 118, 210)',
    purple: 'rgb(156, 39, 176)',
    green: 'rgb(46, 125, 50)',
    orange: 'rgb(237, 108, 2)',
    red: 'rgb(211, 47, 47)'
  });
  const [theme, setTheme] = React.useState(createTheme({
    palette: {
      mode: brightnessMode,
      primary: {
        main: myColors[colorTheme]
      }
    }
  }));

  React.useEffect(() => {
    const color = myColors[colorTheme];
    if(color !== theme.palette.primary.main || brightnessMode !== theme.palette.mode){
      setTheme(createTheme({
        palette: {
          mode: brightnessMode,
          primary: {
            main: color
          }
        }
      }));
    }
  }, [colorTheme, brightnessMode, theme, myColors]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component='main'>
      <CssBaseline />
      <ResponsiveAppBar /> 
      <Box mt={10}>
        <Typography variant="h4">Settings</Typography>
        <Grid container sx={{
          mt: 4,
          '--Grid-borderWidth': '1px',
          // borderTop: 'var(--Grid-borderWidth) solid',
          borderLeft: 'var(--Grid-borderWidth) solid',
          borderColor: 'divider',
          '& > div': {
            borderRight: 'var(--Grid-borderWidth) solid',
            // borderBottom: 'var(--Grid-borderWidth) solid',
            borderColor: 'divider',
          },
        }}>
          <Grid xs={4}>
            <Container>
            <Typography variant="h5">Favorites</Typography>
              <Favorites />
            </Container>
          </Grid>
          <Grid xs={4}>
            <Container disableGutters>
            <Typography variant="h5">Preferences</Typography>
              <Preferences
                colorTheme={colorTheme}
                setColorTheme={setColorTheme}
                brightnessMode={brightnessMode}
                setBrightnessMode={setBrightnessMode}
              />
            </Container>
          </Grid>
          <Grid xs={4}>
            <Container>
            <Typography variant="h5">Goals</Typography>
              <Goals />
            </Container>
          </Grid>
        </Grid>
      </Box>
      </Container>
    </ThemeProvider>
  );
}
