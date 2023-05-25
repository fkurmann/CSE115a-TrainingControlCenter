import React from 'react';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
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
    <ThemeProvider theme={userTheme}>
      <CssBaseline />
      <Container component='main'>
        <CssBaseline />

        <ResponsiveAppBar />
        <h1>Training Control Center, {localStorage.getItem('user')}: Activities </h1>
        <Box>
          <ActivityGrid></ActivityGrid>
        </Box>

      </Container>
    </ThemeProvider>
  );
}
