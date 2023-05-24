import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import Grid from '@mui/system/Unstable_Grid/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ResponsiveAppBar from '../Components/appBar';
import AddGraphForm from '../Components/addGraphForm';
import { userTheme } from '../Components/theme';
import ActivitiesChart from '../Components/activitiesChart'
import defaultImage from '../Components/images/default.png';
import generalGraph from '../Components/images/generalGraph.png';

/**
 * Creates the Data Center Page for details data analysis.
 *
 * @return {HTMLElement} - the data center page
 */
export default function DataCenter() {
  return (
    <ThemeProvider theme={userTheme}>
      <CssBaseline />
      <Container component='main'>
        <CssBaseline />

        <ResponsiveAppBar />
        <h1>Training Control Center, {localStorage.getItem('user')}: Data Center</h1>
        <Box>
          <ActivitiesChart/>
          <Grid container spacing={12} sx={{mt: 1}}>
          <Grid xs={4}>
            <AddGraphForm />
          </Grid>
          <Grid container xs={5}>
            <Box
              component="img"
              sx={{
                height: 500,
                width: 500,
              }}
              alt={defaultImage}
              src={generalGraph}
            />
          </Grid>
        </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
