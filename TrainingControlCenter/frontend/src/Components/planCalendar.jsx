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

// Get Data
// Perhaps adding activities right in calendar as a future option.
/**
 * Function to display the calendar populated with planned activities
 *
 * @return {object} - the caldenar component rendering
 */
export default function PlanCalendar() {
  const user = localStorage.getItem('user');
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
    endDate: usaTime(activity.end.dateTime),
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
    if (data.length === 0) {
      console.log("Loading planned activities");
      fetch("http://localhost:3010/v0/plannedActivities?" +
        new URLSearchParams({
          username: user,
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
            setData(res);
          }
        })
        .catch((err) => {
          console.error(err);
          alert(`Error retrieving planned activities for user ${user}`);
        })
    }
    setLoading(false);
  };

  React.useEffect(() => {
    setIsLoading(true);
    getData(setData, setLoading);
    setIsLoading(false);
  }, [setData, currentViewName, currentDate, loading, isLoading, setLoading]);

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
        <Appointments onClick={test}/>
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

function test() {
    console.log("HI");
}
