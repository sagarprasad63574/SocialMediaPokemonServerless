import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import Header from './components/headers/Header'

import TestComponent from './components/TestComponent/TestComponent';
import LoginScreen from './components/user/LoginScreen';
import ProtectedRoute from './components/routing/ProtectedRoutes';
import ProfileScreen from './components/profiles/ProfileScreen';
import TeamsScreen from './components/teams/MyTeamsContainer';
import RegisterScreen from './components/user/RegisterScreen';
import AddTeamContainer from './components/teams/AddTeamContainer';
import CommentsContainer from './components/comments/CommentsContainer';
import HomePageController from './components/homepage/HomePageController';

function App() {
  return (
    <Router>
      <Header />
      <main className='container content'>
        <Routes>
          <Route path='/register' element={<RegisterScreen />} />
          <Route path='/login' element={<LoginScreen />} />

          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<HomePageController />} />
            <Route path='/profile' element={<ProfileScreen />} />
            <Route path='/teams' element={<TeamsScreen />} />
            <Route path='/teams/add' element={<AddTeamContainer />} />
            <Route path='/comments' element={<CommentsContainer />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
