import React from 'react';
import {
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Stack,
} from '@mui/material';

import SportIcon from './sportIcon';

export default function HomeCalendar() {
  const user = localStorage.getItem('user');
  const [weeklyActivities, setWeeklyActivities] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isGetActivities, setIsGetActivities] = React.useState(true)
  const [dayActivities, setDayActivities] = React.useState({})
  // var dayActivities = {};

  React.useEffect(() => {
    if (weeklyActivities.length === 0) {
      console.log("Loading weekly activities");
        setIsLoading(true);
        setIsGetActivities(true);
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
            if (res.length > 0) {
              console.log("Loaded weekly activities", res);
              setWeeklyActivities(res);
              setIsGetActivities(false);
            }
          })
          .catch((err) => {
            console.error(err);
            alert(`Error retrieving activities for user ${user}`);
          })
    } else {
      setIsLoading(false);
    }
  }, [user, weeklyActivities, isLoading, isGetActivities]);

  React.useEffect(() => {
    if (isGetActivities === false && isLoading === true) {
      for (let i = 0; i < 7; i++) {
        setDayActivities[i] = getActivitiesForDay(weeklyActivities, i.toString());
        console.log(getActivitiesForDay(weeklyActivities, i.toString()))
      }
      console.log(dayActivities);
      setIsLoading(false);
    }
  }, [isGetActivities, weeklyActivities, isLoading, dayActivities]);

  React.useEffect(() => {
    if (isLoading === false) {
      console.log(dayActivities);
    }
  }, [dayActivities, isLoading])

  return (
    <>
    {
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
        /*idea make separate file and export it
        call function to get list of activities for tuesday (each day)
        pass list into new function jsx imported file to get returned icon list using*/

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

function getActivitiesForDay(activities, day) {
  var day_activities = []
  for (let i = 0; i < activities.length; i++) {
    if (new Date(activities[i]["json"]["start_date_local"]).getDay().toString() === day) {
      day_activities.push(activities[i]);
    }
  }
  return day_activities;
}
