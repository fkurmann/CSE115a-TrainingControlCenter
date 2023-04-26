import * as React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import ResponsiveAppBar from './appBar';
import Favorites from './favorites';

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
    <Grid xs={6}>
    <Typography gutterBottom>Current user: {localStorage.getItem("user")}</Typography>
    </Grid>
    </Grid>
    </>
  );
}
