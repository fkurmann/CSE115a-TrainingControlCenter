import { BrowserRouter, Route, Routes, Navigate, Switch } from 'react-router-dom';

import Home from './Components/Home';
import Settings from './Components/Settings';
import Login from './Components/auth';
import StravaAuth from './Components/stravaAuth';
import DataCenter from './Components/DataCenter';
import PlanTraining from './Components/PlanTraining';


const AuthenticatedRoute = ({children}) => {
  if (localStorage.getItem('user')) {
    return children;
  }
  return <Navigate to='/login' replace />;
}; // Authentication to be added 

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/'
        element={
          // <AuthenticatedRoute>
            <Home />
          // </AuthenticatedRoute>
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
      <Route path='/stravaAuth' element={<StravaAuth />}/>

      <Route path='/login' element={<Login />} />
    </Routes>
  </BrowserRouter>
  );
}
