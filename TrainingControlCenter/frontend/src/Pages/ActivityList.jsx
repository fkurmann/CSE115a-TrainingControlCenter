import React from 'react';
import {ThemeProvider} from '@mui/material/styles';
import { 
  Typography, 
  Box,
  CssBaseline,
  Container 
} from '@mui/material';
import ResponsiveAppBar from '../Components/appBar';
import ActivityGrid from '../Components/dataGrid';
import { userTheme } from '../Components/theme';



/**
 * The page to list all activities and recent activities, whether manual or from strava.
 *
 * @return {HTMLElement} - Creates the Workout List page to display all activities.
 */
export default function ActivityList() {
  return (
    <ThemeProvider theme={userTheme()}>
      <CssBaseline />
      <Container component='main'>
        <ResponsiveAppBar />
        <Box mt={10}>
        <Typography variant="h4">Activities</Typography>
          <ActivityGrid />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
