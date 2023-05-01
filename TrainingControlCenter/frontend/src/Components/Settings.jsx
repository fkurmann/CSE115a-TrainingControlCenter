import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import ResponsiveAppBar from './appBar';
import Favorites from './Settings/favorites';
import Goals from './Settings/goals';

export default function Settings() {
  return (
    <>
      <ResponsiveAppBar>

      </ResponsiveAppBar>
    
    <Grid container spacing={2}>
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
    </>
  );
}
