import React from 'react';
import {ThemeProvider} from '@mui/material/styles';
// import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ResponsiveAppBar from '../Components/appBar';
import { userTheme } from '../Components/theme';
import AddPlannedActivityForm from '../Components/addPlannedActivityForm';
import AddPlannedSummary from '../Components/addPlannedSummary';
import PlanCalendar from '../Components/planCalendar';
import AddPlanGraphForm from '../Components/addPlanGraphForm';

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
        <ResponsiveAppBar />
        <Typography variant="h4">Training Control Center, {localStorage.getItem('user')}: Plan Training</Typography>
        <Box mt={2} mb={2}>
          <div className='parent'>
            <div style={{float: 'left'}}>
              <Box sx={{display: 'inline-flex', justifyContent: 'space-evenly'}}>
                <Box sx={{p: 1, m: 1}}><AddPlannedActivityForm /></Box>
                <Box sx={{p: 1, m: 1}}><AddPlannedSummary /></Box>
              </Box>
              <Box sx={{display: 'inline-flex', p: 1, m: 1}}><AddPlanGraphForm /></Box>
            </div>
          </div>
        </Box>
        <Box mt={2}>
          <PlanCalendar></PlanCalendar>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
