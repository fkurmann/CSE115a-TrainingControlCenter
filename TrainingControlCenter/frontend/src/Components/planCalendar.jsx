import * as React from 'react';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Appointments,
  AppointmentTooltip,
  Scheduler,
  WeekView,
  DayView,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';

const test = [
  {
    "kind": "calendar#event",
    "summary": "Test Item",
    "start": {"dateTime": "2023-06-01T18:00:00+01:00",
              "timeZone": "UTC"},
    "end": {"dateTime": "2023-06-01T20:00:00+01:00",
           "timeZone": "UTC"},
    "sequence": 9,
    "eventType": "default",
  },
  {
  "kind": "calendar#event",
  // "created": "2015-05-27T10:27:10.000Z",
  // "updated": "2017-06-19T08:11:04.785Z",
    "summary": "Test Item 2",
    "start": {"dateTime": "2023-05-30T18:00:00+01:00",
              "timeZone": "UTC"},
    "end": {"dateTime": "2023-05-30T20:00:00+01:00",
            "timeZone": "UTC"},
    "sequence": 9,
    "eventType": "default",
  }];
const test2 = [{
  "kind": "calendar#event",
  // "created": "2015-05-27T10:27:10.000Z",
  // "updated": "2017-06-19T08:11:04.785Z",
  "summary": "Test Item 2",
  "start": {"dateTime": "2023-05-30T18:00:00+01:00",
            "timeZone": "UTC"},
  "end": {"dateTime": "2023-05-30T20:00:00+01:00",
          "timeZone": "UTC"},
  "sequence": 9,
  "eventType": "default",
}];

// Get Data
// Perhaps adding activities right in calendar as a future option.
/**
 * Function to display the calendar populated with planned activities
 *
 * @return {object} - the caldenar component rendering
 */
export default function PlanCalendar() {
  const user = localStorage.getItem('user');
  const [weeklyActivities, setWeeklyActivities] = React.useState(null);
  const [dayActivities, setDayActivities] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const usaTime = date => new Date(date).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
  const initialState = {
    data: [],
    loading: false,
    currentDate: new Date(),
    currentViewName: 'Week',
  };

  const reducer = (state, action) => {
    console.log('Reducer', state, action);
    switch (action.type) {
      case 'setLoading':
        return { ...state, loading: action.payload }
      case 'setData':
        return { ...state, data: action.payload.map(mapActivityData) };
      case 'setCurrentViewName':
        return { ...state, currentViewName: action.payload };
      case 'setCurrentDate':
        return { ...state, currentDate: action.payload };
      default:
        return state;
    }
  };

  const mapActivityData = activity => ({
    id: activity.id,
    startDate: usaTime(activity.start.dateTime),
    endDate: usaTime(activity.end.dateTime), // +1!
    title: activity.summary,
  });

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {data, loading, currentViewName, currentDate,} = state;
  const setCurrentViewName = React.useCallback(nextViewName => dispatch({type: 'setCurrentViewName', payload: nextViewName}), [dispatch]);
  const setData = React.useCallback(nextData => dispatch({ type: 'setData', payload: nextData}), [dispatch]);
  const setCurrentDate = React.useCallback(nextDate => dispatch({type: 'setCurrentDate', payload: nextDate}), [dispatch]);
  const setLoading = React.useCallback(nextLoading => dispatch({type: 'setLoading', payload: nextLoading}), [dispatch]);

  const getData = (setData, setLoading) => {
    setLoading(true);
    setData(test);
    console.log(test2);
    setLoading(false);
  };

  React.useEffect(() => {
    getData(setData, setLoading);
  }, [setData, currentViewName, currentDate, setLoading]);

  React.useEffect(() => {
    if (!weeklyActivities) {
      console.log("Loading planned activities");
      setIsLoading(true);
      const d = new Date();
      fetch("http://localhost:3010/v0/plannedActivities?" +
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
            console.log("Loaded planned activities", res);
            setWeeklyActivities(res);
            let temp = {}
            for (let i = 0; i < 7; i++) {
              temp[i] = getActivitiesForDay(res, i.toString())
            }
            setDayActivities(temp);
            // setData(res.json);
            // setLoading(false);
          } else if (res.length === 0) {
            console.log("Loaded planned activities, 0", res);
            setWeeklyActivities(["no activities"])
            let temp = {0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []};
            setDayActivities(temp);
            // setData(res.json);
            // setLoading(false);
          }
        })
        .catch((err) => {
          console.error(err);
          alert(`Error retrieving planned activities for user ${user}`);
        })
    } else {
      setIsLoading(false);
    }
  }, [user, weeklyActivities, isLoading, loading, dayActivities]); //setData, currentViewName, currentDate

  return (
    <>
    {
    isLoading ?
    <CircularProgress sx={{ position: 'absolute', top: '10%', right: '15%' }}/> :
    <Paper>
      <Scheduler
        data={data}
        height={660}
      >
        <ViewState
          currentDate={currentDate}
          currentViewName={currentViewName}
          onCurrentViewNameChange={setCurrentViewName}
          onCurrentDateChange={setCurrentDate}
        />
        <DayView
          startDayHour={5.5}
          endDayHour={21.5}
        />
        <WeekView
          startDayHour={5.5}
          endDayHour={21.5}
        />
        <Appointments />
        <Toolbar/>
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <AppointmentTooltip
          showCloseButton
        />
      </Scheduler>
    </Paper>
  } 
  </>
  );
};

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
    if (new Date(activities[i]['start_date_local']).getDay().toString() === day) {
      // Remove duplicate activities
      if(day_activities.filter((a) => {
          return activities[i].distance === a.distance &&
                activities[i].moving_time === a.moving_time &&
                activities[i].name === a.name &&
                activities[i].start_date_local === a.start_date_local &&
                activities[i].sport_type === a.sport_type
        }).length > 0) {
        continue;
      }
      day_activities.push(activities[i]);
    }
  }
  return day_activities;
}
