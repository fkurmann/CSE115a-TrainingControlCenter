import { BrowserRouter, Route, Routes, Navigate, Switch } from 'react-router-dom';
import Home from './Pages/Home';
import Settings from './Pages/Settings';
import Login from './Pages/Auth';
import StravaAuth from './Pages/StravaAuth';
import DataCenter from './Pages/DataCenter';
import PlanTraining from './Pages/PlanTraining';
import WorkoutList from './Pages/WorkoutList';

const AuthenticatedRoute = ({children}) => {
  if (localStorage.getItem('user')) {
    return children;
  }
  return <Navigate to='/login' replace />;
};

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/'
        element={
          <AuthenticatedRoute>
            <Home />
          </AuthenticatedRoute>
        }
      />
      <Route path='/settings'
        element={
          <AuthenticatedRoute>
            <Settings />
          </AuthenticatedRoute>
        }
      />
      <Route path='/dataCenter'
        element={
          <AuthenticatedRoute>
            <DataCenter />
          </AuthenticatedRoute>
        }
      />
      <Route path='/planTraining'
        element={
          <AuthenticatedRoute>
            <PlanTraining />
          </AuthenticatedRoute>
        }
      />
      <Route path='/workoutList'
        element={
          <AuthenticatedRoute>
            <WorkoutList />
          </AuthenticatedRoute>
        }
      />
      <Route path='/stravaAuth' element={<StravaAuth />}/>

      <Route path='/login' element={<Login />} />
    </Routes>
  </BrowserRouter>
  );
}
