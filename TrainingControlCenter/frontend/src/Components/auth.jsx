import React from 'react';
import {useNavigate} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

/**
 * Create the theme to be used
 */
const theme = createTheme();

/**
 * MUI login page
 * @return {object} the login page
 */
export default function Login() {
  const history = useNavigate();
  const [user, setUser] = React.useState({username: '', password: ''});

  React.useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('stravaAccessToken');
  }, []);

  const handleInputChange = (event) => {
    const {value, name} = event.target;
    const u = user;
    u[name] = value;
    setUser(u);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('http://localhost:3010/v0/login', {
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
        localStorage.setItem('user', json.username);
        localStorage.setItem('accessToken', json.accessToken);
        localStorage.setItem('favorites', JSON.stringify(json.favorites)); // localStorage can only store strings
        history('/');
      })
      .catch((err) => {
        alert('Error logging in, please try again');
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
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
        </Box>
      </Container>
    </ThemeProvider>
  );
}
