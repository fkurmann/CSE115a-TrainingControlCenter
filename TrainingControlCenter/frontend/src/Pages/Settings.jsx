import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import ResponsiveAppBar from '../Components/appBar';
import Favorites from '../Components/Settings/favorites';
import Goals from '../Components/Settings/goals';

/**
 * Create the theme to be used
 */
const theme = createTheme();

export default function Settings() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component='main'>
      <CssBaseline />
      <ResponsiveAppBar /> 
      <Grid container spacing={12} sx={{mt: 1}}>
        <Grid xs={4}>
          <h1>Favorites</h1>
          <Favorites></Favorites>
        </Grid>
        <Grid container xs={5}>
          <Grid xs={12}>
            <h1>Goals</h1>
            <Goals></Goals>
          </Grid>
          <Grid xs={12}>
            <h1>Units</h1>
          </Grid>
        </Grid>
      </Grid>
      </Container>
    </ThemeProvider>
  );
}
