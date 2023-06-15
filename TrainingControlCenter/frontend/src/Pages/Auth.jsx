import React from 'react';
import {useNavigate} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {
  Avatar,
  Backdrop,
  CircularProgress,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  Snackbar,
  Alert,
  Button
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

/**
 * Create the theme to be used
 */
const theme = createTheme();

/**
 * MUI login page
 *
 * @return {object} - the login page
 */
export default function Login() {
  const history = useNavigate();
  const [user, setUser] = React.useState({username: '', password: ''});
  const [openBackdrop, setOpenBackdrop] = React.useState(false); // Is user currently registering an account or logging in?
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [snackbarStatus, setSnackbarStatus] = React.useState('success'); // 'success' or 'error'
  const [snackbarMsg, setSnackbarMsg] = React.useState('');

  React.useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('goals');
    localStorage.removeItem('isMetric');
    localStorage.removeItem('colorTheme');
    localStorage.removeItem('brightnessMode');
    localStorage.removeItem('activityMapColor');
    localStorage.removeItem('activityMapMarkers');
  }, []);

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const handleSubmit = (event) => {
    setOpenBackdrop(true);
    event.preventDefault();
    fetch('https://training-control-center-1-0.onrender.com/v0/login', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        setOpenBackdrop(false);
        setOpenSnackbar(true);
        setSnackbarStatus('success');
        setSnackbarMsg('Logging in...');
        localStorage.setItem('user', json.username);
        localStorage.setItem('accessToken', json.accessToken);
        localStorage.setItem('favorites', decodeURIComponent(JSON.stringify(json.favorites))); // localStorage can only store strings
        localStorage.setItem('isMetric', json.isMetric);
        localStorage.setItem('brightnessMode', json.brightnessMode);
        localStorage.setItem('colorTheme', json.colorTheme);
        localStorage.setItem('activityMapColor', json.activityMapColor);
        localStorage.setItem('activityMapMarkers', json.activityMapMarkers);
        history('/');
      })
      .catch((err) => {
        setOpenBackdrop(false);
        setOpenSnackbar(true);
        setSnackbarStatus('error');
        setSnackbarMsg('Invalid username or password');
      });
  };

  const handleRegister = (event) => {
    setOpenBackdrop(true);
    event.preventDefault();
    fetch('https://training-control-center-1-0.onrender.com/v0/register', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then((json) => {
        setOpenBackdrop(false);
        setOpenSnackbar(true);
        setSnackbarStatus('success');
        setSnackbarMsg('Account registered!');

      })
      .catch((err) => {
        setOpenBackdrop(false);
        setOpenSnackbar(true);
        setSnackbarStatus('error');
        setSnackbarMsg('Please enter a unique username and password');
      });
  };

  const handleCloseSnackbar = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component='main' maxWidth='xs'>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{m: 1}}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Training Control Center
          </Typography>

          {/* Username and password boxes */}
          <Box component='form' onSubmit={handleSubmit}
            noValidate sx={{mt: 1}}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Username'
              name='username'
              autoComplete='username'
              autoFocus
              data-testid='usr'
              onChange={handleInputChange}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              data-testid='pw'
              onChange={handleInputChange}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{mt: 3, mb: 2}}
            >
              Sign In
            </Button>
          </Box>
          <Button onClick={handleRegister}
              type='register'
              fullWidth
              variant='contained'
              sx={{mt: 3, mb: 2}}
            >
              Register
          </Button>
        </Box>
      </Container>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbarStatus} onClose={handleCloseSnackbar}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}
