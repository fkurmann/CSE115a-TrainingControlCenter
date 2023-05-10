import React from 'react';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Stack,
} from '@mui/material';

import SportIcon from './SportIcon';

export default function HomeCalendar() {
  const user = localStorage.getItem('user');
  const [weeklyActivities, setWeeklyActivities] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (weeklyActivities.length === 0) {
      console.log("Loading weekly activities");
        setIsLoading(true);
        const d = new Date();
        fetch("http://localhost:3010/v0/activities?" +
            new URLSearchParams({
              username: user,
              minDate: getFirstDayOfWeek(d),
              maxDate: getLastDayOfWeek(d),
            }),
          {
          method: "GET",
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
          .then((res) => {
            if (res) {
              console.log("Loaded weekly activities", res);
              setWeeklyActivities(res);
              // display icons before rendering loading false
              setIsLoading(false);
            }
          })
          .catch((err) => {
            console.error(err);
            alert(`Error retrieving activities for user ${user}`);
          })
    } else {
      setIsLoading(false);
    }
  }, [user, weeklyActivities, isLoading]);

  return (
    <>
    {
    isLoading ?
    <CircularProgress /> :
    <>
    <h2 align="right">Calendar/Week</h2>
    <div style={{ width: '100%' }}>
      <Box
        sx={{
          justifyContent: 'space-between',
          display: 'inline-flex',
          flexDirection: 'row',
          p: 1,
          m: 1,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
          borderRadius: 1,
        }}
      >
        <Item sx={{ width: 75, fontSize: 20 }}><u>M</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        <IconButton size="large">
          <SportIcon sport="bike" fontSize="125%"/>
        </IconButton>
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>Tu</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>W</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>Th</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>F</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>Sa</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>Su</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        </Stack>
        </Item>
      </Box>
    </div>
    </>
    }
    </>
  );
}

function Item(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        p: 1,
        m: 1,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

function getFirstDayOfWeek(d) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const newDate = new Date(date.setDate(diff))
    return newDate.toISOString();
}

function getLastDayOfWeek(d) {
    const date = new Date(getFirstDayOfWeek(d));
    date.setDate(date.getDate() + 6);
    return date.toISOString();
}

