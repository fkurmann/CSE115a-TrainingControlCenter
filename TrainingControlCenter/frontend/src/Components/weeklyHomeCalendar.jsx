import React from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Popover,
  Typography
} from '@mui/material';
import SportIcon from './sportIcon';
import ActivityCard from './activityCard';

/**
 * Generates calendar of current week's activities, whether manual or from strava.
 *
 * @return {HTMLElement} - Calendar display with clickable icons of weekly activities.
 */
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
    setSelectedActivity(activity);
    setAnchorElActivityCard(event.currentTarget);
  }
  const handleCloseActivityCard = () => setAnchorElActivityCard(null);

  return (
    <>
    {
    isLoading ?
    <CircularProgress /> :
    <>
    <Typography variant="h5" align="right">Current Week Overview</Typography>
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

/**
 * Creates the layout for individual days/items of the weekly calendar.
 *
 * @param {HTMLElement} [props] - defines passed in attributes for item, like width and font size.
 * @return {HTMLElement} - returns a MUI box with for displaying each day.
 */
function Item(props) {
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

/**
 * Function to get the first day of the week, monday, from date d.
 *
 * @param {string} d - some date format to be checked
 * @return {string} - the date of the monday of the week of date d.
 */
function getFirstDayOfWeek(d) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const newDate = new Date(date.setDate(diff))
  return newDate.toISOString();
}

/**
 * Function to get the last day of the week, monday, from date d.
 *
 * @param {string} d - some date format to be checked
 * @return {string} - the date of the sunday of the week of date d.
 */
function getLastDayOfWeek(d) {
  const date = new Date(getFirstDayOfWeek(d));
  date.setDate(date.getDate() + 7);
  return date.toISOString();
}

/**
 * Fetch activities found in database for user for specified day.
 *
 * @param {string} activities - JSON list of all activities for current user.
 * @param {string} day - specifies day of week, where monday is 0 and sunday is 6.
 * @return {string} - JSON list of all activities for specified day.
 */
function getActivitiesForDay(activities, day) {
  let day_activities = []
  for (let i = 0; i < activities.length; i++) {
    // Should be start_date instead of start_date_local
    if (new Date(activities[i]['json']['start_date']).getDay().toString() === day) {
      // Remove duplicate activities
      if(day_activities.filter((a) => {
          return activities[i].json.distance === a.distance &&
                 activities[i].json.moving_time === a.moving_time &&
                 activities[i].json.name === a.json.name &&
                 activities[i].json.start_date === a.json.start_date &&
                 activities[i].json.sport_type === a.json.sport_type
        }).length > 0) {
        continue;
      }
      day_activities.push(activities[i]);
    }
  }
  return day_activities;
}
