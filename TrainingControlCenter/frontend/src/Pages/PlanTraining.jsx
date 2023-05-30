import React from 'react';
import {ThemeProvider} from '@mui/material/styles';
// import Button from '@mui/material/Button';
import Grid from '@mui/system/Unstable_Grid/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import ResponsiveAppBar from '../Components/appBar';
import { userTheme } from '../Components/theme';
import AddPlannedActivityForm from '../Components/addPlannedActivityForm';
import PlanCalendar from '../Components/planCalendar';
import AddPlanGraphForm from '../Components/addPlanGraphForm';


/**
 * Creates the Training Plan page for workout creation and planning.
 *
 * @return {HTMLElement} - creates the page for planning workouts and training.
 */
export default function PlanTraining() {
  return (
    <ThemeProvider theme={userTheme}>
      <CssBaseline />
      <Container component='main'>
        <CssBaseline />
        <ResponsiveAppBar />
        <Typography variant="h4">Training Control Center, {localStorage.getItem('user')}: Plan Training</Typography>
        <Box>
          
        </Box>
        <Box>
          <div className='parent'>
            <div style={{float: 'left'}}>
              <AddPlannedActivityForm />
            </div>
            <div style={{float: 'right'}}>
              <PlanCalendar></PlanCalendar>
            </div>
          </div>
          <Grid xs={4}>
            <AddPlanGraphForm />
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
