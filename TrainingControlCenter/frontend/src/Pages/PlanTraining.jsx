import React from 'react';
import {ThemeProvider} from '@mui/material/styles';
// import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ResponsiveAppBar from '../Components/appBar';
import { userTheme } from '../Components/theme';
import AddPlannedActivityForm from '../Components/addPlannedActivityForm';

/**
 * Creates the Training Plan page for workout creation and planning.
 *
 * @return {HTMLElement} - creates the page for planning workouts and training.
 */
export default function PlanTraining() {
  return (
    <ThemeProvider theme={userTheme()}>
      <CssBaseline />
      <Container component='main'>
        <CssBaseline />
        <ResponsiveAppBar />
        <h1>Training Control Center, {localStorage.getItem('user')}: Plan Training</h1>
        <Box>
          <AddPlannedActivityForm />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
