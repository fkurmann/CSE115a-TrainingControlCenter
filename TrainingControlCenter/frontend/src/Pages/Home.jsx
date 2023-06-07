import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ResponsiveAppBar from '../Components/appBar';
import AddActivityForm from '../Components/addActivityForm';
import HomeCalendar from '../Components/weeklyHomeCalendar';
import { userTheme } from '../Components/theme';

/**
 * Creates the Home page upon successful user login.
 *
 * @return {HTMLElement} - Creates the Home Page with MUI elements.
 */
export default function Home() {
  return (
    <ThemeProvider theme={userTheme()}>
      <CssBaseline />
      <Container component='main'>
        <ResponsiveAppBar />
        <Box mt={2}>
          <div className='parent'>
            <div style={{float: 'left'}}>
              <AddActivityForm />
            </div>
            <div style={{float: 'right'}}>
              <HomeCalendar></HomeCalendar>
            </div>
          </div>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

