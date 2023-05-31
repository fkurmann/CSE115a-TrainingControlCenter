import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { getFiveActivities } from '../Components/stravaData';
import ResponsiveAppBar from '../Components/appBar';
import AddActivityForm from '../Components/addActivityForm';
import HomeCalendar from '../Components/weeklyHomeCalendar';
import { userTheme } from '../Components/theme';
import { Typography } from '@mui/material';

/**
 * Creates the Home page upon successful user login.
 *
 * @return {HTMLElement} - Creates the Home Page with MUI elements.
 */
export default function Home() {
  return (
    <ThemeProvider theme={userTheme()}>
      <CssBaseline />
      <Container component='main'>
        <ResponsiveAppBar />
        <Typography variant="h4">Training Control Center, {localStorage.getItem('user')}</Typography>
        <Box mt={2}>
          <div className='parent'>
            <div style={{float: 'left'}}>
              <AddActivityForm />
              <Button
                onClick={() => getFiveActivities()}
                type='upload'
                variant='contained'
                sx={{mt: 3, mb: 2}}
              >
              Upload Activities From Strava
              </Button>
            </div>
            <div style={{float: 'right'}}>
              <HomeCalendar></HomeCalendar>
            </div>
          </div>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

