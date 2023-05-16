import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ResponsiveAppBar from '../Components/appBar';
import ActivitiesChart from '../Components/activitiesChart'; // import starActivities

/**
 * Create the theme to be used
 */
const theme = createTheme();

export default function DataCenter() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component='main'>
        <CssBaseline />

        <ResponsiveAppBar />
        <h1>Training Control Center, {localStorage.getItem('user')}: Data Center</h1>
        <Box>
          <ActivitiesChart/>
        </Box>

      </Container>

    </ThemeProvider>
  );
}
