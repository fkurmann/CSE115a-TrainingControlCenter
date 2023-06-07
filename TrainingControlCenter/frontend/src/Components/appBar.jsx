import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { getFiveActivities } from './stravaData';
import { getAllActivities } from './stravaData';

/**
 * Create the display for the webpage's application bar.
 *
 * @return {HTMLElement} - includes pages for Data Center, Activity Lists, Settings, and more.
 */
export default function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    setAnchorElUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  };

  // This function creates a random avatar color based on username.
  // Taken from https://mui.com/material-ui/react-avatar/
  const avatarColor = (username) => {
    let hash = 0;
    for (let i = 0; i < username.length; i += 1) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Training Control Center
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem component='a' onClick={handleCloseNavMenu} href='/'>Home</MenuItem>
              <MenuItem component='a' onClick={handleCloseNavMenu} href='/activityList'>Activity List</MenuItem>
              <MenuItem component='a' onClick={handleCloseNavMenu} href='/dataCenter'>Data Center</MenuItem>
              <MenuItem component='a' onClick={handleCloseNavMenu} href='/planTraining'>Plan Training</MenuItem>
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            TCC
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={handleCloseNavMenu}
              href='/'
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Home
            </Button>
            <Button
              onClick={handleCloseNavMenu}
              href='/activityList'
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Activity List
            </Button>
            <Button
              onClick={handleCloseNavMenu}
              href='/dataCenter'
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Data Center
            </Button>
            <Button
              onClick={handleCloseNavMenu}
              href='/planTraining'
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Plan Training
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: avatarColor(localStorage.getItem('user') || '_') }} alt="avatar" >
                  {(localStorage.getItem('user') || '_').charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
                <MenuItem component='a' onClick={handleCloseUserMenu} href='/settings'>Settings</MenuItem>
                <MenuItem component='a' href={`https://www.strava.com/oauth/authorize` +
                                                                            `?client_id=105448` +
                                                                            `&response_type=code` +
                                                                            `&redirect_uri=http://localhost:3000/stravaAuth` +
                                                                            `&approval_prompt=force` +
                                                                            `&scope=read_all,activity:read_all,profile:read_all`}>
                Sync Strava Profile
                </MenuItem>
                <MenuItem component='a' onClick={() => getAllActivities()}>Upload ALL Strava Activities</MenuItem>
                <MenuItem component='a' onClick={() => getFiveActivities()}>Upload 5 Strava Activities</MenuItem>
                <MenuItem component='a' onClick={handleLogout} href='/login'>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
