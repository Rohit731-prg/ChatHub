import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ErrorPage from './Components/ErrorPage';
import Profile from './Components/Profile';
import Loading from './Components/Loading';
import Login from './Components/Auth/Login';
import Signin from './Components/Auth/Signin';
import OPTSignin from './Components/Auth/OPTSignin';
import UserDetails from './Components/ProfilePage/UserDetails';

function App() {
  return (
   <Router>
    <Routes>
      <Route path='*' element={<ErrorPage />} />
      <Route path='/' element={<Loading />} />
      <Route path='/profile/:id' element={<Profile />} />
      <Route path='/signup' element={<Signin />} />
      <Route path='/login' element={<Login />} />
      <Route path='/optSignin/:id' element={<OPTSignin />} />
      <Route path='/UserDetails/:id' element={<UserDetails />} />
    </Routes>
   </Router>
  )
}

export default App