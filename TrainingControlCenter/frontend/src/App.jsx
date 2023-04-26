import { BrowserRouter, Route, Routes, Navigate, Switch } from 'react-router-dom';

import Home from './Components/Home';
import Settings from './Components/Settings';
import Login from './Components/auth';


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
          // <AuthenticatedRoute>
            <Settings />
          // </AuthenticatedRoute>
        }
      />
      <Route path='/login' element={<Login />} />
    </Routes>
  </BrowserRouter>
  );
}