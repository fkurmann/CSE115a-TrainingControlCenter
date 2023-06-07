import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { 
  Typography,
  Box,
  Container,
  CssBaseline,
  Grid,
} from '@mui/material';
import ResponsiveAppBar from '../Components/appBar';
import AddGraphForm from '../Components/addGraphForm';
import { userTheme } from '../Components/theme';
import ActivitiesChart from '../Components/activitiesChart'
import defaultImage from '../Components/images/default.png';
import generalGraph from '../Components/images/generalGraph.png';
import pieGraph from '../Components/images/pieGraph.png';


/**
 * Creates the Data Center Page for details data analysis.
 *
 * @return {HTMLElement} - the data center page
 */
export default function DataCenter() {
  return (
    <ThemeProvider theme={userTheme()}>
      <CssBaseline />
      <Container component='main'>
        <ResponsiveAppBar />
        <Box mt={10}>
        <Typography variant="h4">Data Center</Typography>
          <ActivitiesChart/>
          <Grid container>
            <Grid item xs={4}>
              <AddGraphForm />
            </Grid>
          <Grid container xs={5}
            alignItems="center"
            justifyContent="center">
            <Typography variant="h5">Line Graphs:</Typography>
            <Box
              component="img"
              sx={{
                height: 500,
                width: 500,
              }}
              alt={defaultImage}
              src={generalGraph}
            />
            <Typography variant="h5">Pie Graphs:</Typography>
            <Box
              component="img"
              sx={{
                height: 500,
                width: 700,
              }}
              alt={defaultImage}
              src={pieGraph}
            />
          </Grid>
        </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
