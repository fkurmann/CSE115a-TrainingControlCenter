import * as React from 'react';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Appointments,
  AppointmentForm,
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
    description: activity.description,
    sport: activity.sport,
    type: activity.type,
    distance: activity.distance,
    time: activity.moving_time,
  });

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {data, loading, currentViewName, currentDate,} = state;
  const setCurrentViewName = React.useCallback(nextViewName => dispatch({type: 'setCurrentViewName', payload: nextViewName}), [dispatch]);
  const setData = React.useCallback(nextData => dispatch({ type: 'setData', payload: nextData}), [dispatch]);
  const setCurrentDate = React.useCallback(nextDate => dispatch({type: 'setCurrentDate', payload: nextDate}), [dispatch]);
  const setLoading = React.useCallback(nextLoading => dispatch({type: 'setLoading', payload: nextLoading}), [dispatch]);

  const BoolEditor = (props) => {
    return null;
  };

  const LabelComponent = (props) => {
    if (props.text === 'Details') {
      return <AppointmentForm.Label text="Activity Details" type="title"/>
    } else if (props.text === 'More Information') {
      return null
    } else if (props.text === '-') {
      return <AppointmentForm.Label
      { ...props}
      />
    }
  };

  const InputComponent = (props) => {
    if (props.type === 'titleTextEditor') {
      return null;
    }
  };
  const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
    const sport_title = appointmentData.sport + " - " + appointmentData.type;
    return (
      <>
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        {...restProps}
      >
      <AppointmentForm.Label text={appointmentData.title} type="title" />
      <AppointmentForm.Label text="Information" type="subtitle" />
      <AppointmentForm.TextEditor
        readOnly
        value={sport_title}
        placeholder="Sport/Activity Type"
      />

      <AppointmentForm.Label text="Distance" type="subtitle" />
      <AppointmentForm.TextEditor
        readOnly
        value={appointmentData.distance}
        placeholder="Distance"
      />

      <AppointmentForm.Label text="Duration" type="subtitle" />
      <AppointmentForm.TextEditor
        readOnly
        value={appointmentData.time}
        placeholder="Duration"
      />

      <AppointmentForm.Label text="Description" type="subtitle" />
      <AppointmentForm.TextEditor
        readOnly
        value={appointmentData.description}
        placeholder="Description"
      />
      </AppointmentForm.BasicLayout>
      </>
    );
  };

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
    // eslint-disable-next-line
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
        <Appointments />
        <Toolbar/>
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <AppointmentTooltip
          showCloseButton
        />
        <AppointmentForm
          readOnly
          basicLayoutComponent={BasicLayout}
          booleanEditorComponent={BoolEditor}
          labelComponent={LabelComponent}
          textEditorComponent={InputComponent}
        />
      </Scheduler>
    </Paper>
  }
  </>
  );
};
