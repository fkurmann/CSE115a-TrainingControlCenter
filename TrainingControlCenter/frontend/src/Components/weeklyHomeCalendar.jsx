import React from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Popover,
} from '@mui/material';

import SportIcon from './sportIcon';
import ActivityCard from './activityCard';

export default function HomeCalendar() {
  const user = localStorage.getItem('user');
  const [weeklyActivities, setWeeklyActivities] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [dayActivities, setDayActivities] = React.useState({});
  const [anchorElActivityCard, setAnchorElActivityCard] = React.useState(null);
  const [selectedActivity, setSelectedActivity] = React.useState({});

  React.useEffect(() => {
    if (!weeklyActivities) {
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
            if (res.length > 0) {
              console.log("Loaded weekly activities", res);
              setWeeklyActivities(res);
              let temp = {}
              for (let i = 0; i < 7; i++) {
                temp[i] = getActivitiesForDay(res, i.toString())
              }
              setDayActivities(temp);
            } else if (res.length === 0) {
              console.log("Loaded weekly activities", res);
              setWeeklyActivities(["no activities"])
              let temp = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []};
              setDayActivities(temp);
            }
          })
          .catch((err) => {
            console.error(err);
            alert(`Error retrieving activities for user ${user}`);
          })
    } else {
      setIsLoading(false);
    }
  }, [user, weeklyActivities, isLoading, dayActivities]);

  const handleOpenActivityCard = (event, activity) => {
    if('json' in activity) setSelectedActivity(activity.json);
    else setSelectedActivity(activity);
    setAnchorElActivityCard(event.currentTarget);
  }
  const handleCloseActivityCard = () => setAnchorElActivityCard(null);

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
        {dayActivities[1].map((activity) => (
          <IconButton key={activity["_id"]} onClick={ (e) => handleOpenActivityCard(e, activity) } size="large">
            <SportIcon sport={activity["sport"]} fontSize="125%"/>
          </IconButton>
        ))}
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>Tu</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        {dayActivities[2].map((activity) => (
          <IconButton key={activity["_id"]} onClick={ (e) => handleOpenActivityCard(e, activity) } size="large">
            <SportIcon sport={activity["sport"]} fontSize="125%"/>
          </IconButton>
        ))}
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>W</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        {dayActivities[3].map((activity) => (
          <IconButton key={activity["_id"]} onClick={ (e) => handleOpenActivityCard(e, activity) } size="large">
            <SportIcon sport={activity["sport"]} fontSize="125%"/>
          </IconButton>
        ))}
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>Th</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        {dayActivities[4].map((activity) => (
          <IconButton key={activity["_id"]} onClick={ (e) => handleOpenActivityCard(e, activity) } size="large">
            <SportIcon sport={activity["sport"]} fontSize="125%"/>
          </IconButton>
        ))}
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>F</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        {dayActivities[5].map((activity) => (
          <IconButton key={activity["_id"]} onClick={ (e) => handleOpenActivityCard(e, activity) } size="large">
            <SportIcon sport={activity["sport"]} fontSize="125%"/>
          </IconButton>
        ))}
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>Sa</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        {dayActivities[6].map((activity) => (
          <IconButton key={activity["_id"]} onClick={ (e) => handleOpenActivityCard(e, activity) } size="large">
            <SportIcon sport={activity["sport"]} fontSize="125%"/>
          </IconButton>
        ))}
        </Stack>
        </Item>

        <Item sx={{ width: 75, fontSize: 20 }}><u>Su</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        {dayActivities[0].map((activity) => (
          <IconButton key={activity["_id"]} onClick={ (e) => handleOpenActivityCard(e, activity) } size="large">
            <SportIcon sport={activity["sport"]} fontSize="125%"/>
          </IconButton>
        ))}
        </Stack>
        </Item>
      </Box>
    </div>
    <Popover
      anchorEl={anchorElActivityCard}
      open={Boolean(anchorElActivityCard)}
      onClose={handleCloseActivityCard}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'center',
        horizontal: 'right'
      }}
    >
      <ActivityCard activity={selectedActivity} />
    </Popover>
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
