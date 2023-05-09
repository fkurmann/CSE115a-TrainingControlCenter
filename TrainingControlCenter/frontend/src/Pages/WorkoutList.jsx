import React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Button from '@mui/material/Button';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ResponsiveAppBar from '../Components/appBar';
import WorkoutGrid from '../Components/dataGrid';

/**
 * Create the theme to be used
 */
const theme = createTheme();

export default function WorkoutList() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component='main'>
        <CssBaseline />

        <ResponsiveAppBar />
        <h1>Training Control Center, {localStorage.getItem('user')}: Workouts </h1>
        <Box>
          <WorkoutGrid></WorkoutGrid>
        </Box>
        
      </Container>
      
    </ThemeProvider>
  );
}
