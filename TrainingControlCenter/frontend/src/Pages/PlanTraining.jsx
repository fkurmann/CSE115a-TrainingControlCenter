import React from 'react';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Button from '@mui/material/Button';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ResponsiveAppBar from '../Components/appBar';

/**
 * Create the theme to be used
 */
const theme = createTheme();

export default function PlanTraining() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component='main'>
        <CssBaseline />

        <ResponsiveAppBar />
        <h1>Training Control Center, {localStorage.getItem('user')}: Plan Training</h1>
        <Box>
        </Box>
        
      </Container>
      
    </ThemeProvider>
  );
}