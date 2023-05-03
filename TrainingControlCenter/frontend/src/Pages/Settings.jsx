import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';import {createTheme, ThemeProvider} from '@mui/material/styles';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

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
      <ResponsiveAppBar /> 
    
      <Grid container spacing={12}>
        <Grid xs={6}>
          <h1>Favorites</h1>
          <Favorites></Favorites>
        </Grid>
        <Grid container xs={6} spacing={2}>
          <Grid xs={12}>
            <h1>Goals</h1>
            <Goals></Goals>
          </Grid>
          <Grid xs={12}>
            <h1>Units</h1>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
