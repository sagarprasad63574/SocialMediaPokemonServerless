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

import LoginContainer from './components/Auth/LoginContainer';
import TestComponent from './components/TestComponent/TestComponent';
import RegisterContainer from './components/Auth/RegisterContainer';
import TeamsContainer from './components/Teams/TeamsContainer';
import LoginScreen from './components/user/LoginScreen';
import ProtectedRoute from './components/routing/ProtectedRoutes';

function App() {
  return (
    // <div className="App">
    //   <Routes>
    //     <Route path='/' element={<TestComponent />}></Route>
    //     <Route path='/login' element={<LoginContainer />}></Route>
    //     <Route path='/register' element={<RegisterContainer />}></Route>
    //     <Route path='/teams' element={<TeamsContainer />}></Route>
    //   </Routes>
    // </div>
    <Router>
      <Header />
      <main className='container content'>
        <Routes>
          {/* <Route path='/' element={<TestComponent />} /> */}
          <Route path='/login' element={<LoginScreen />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<TestComponent />} />
          </Route>
          {/* <Route path='/register' element={<RegisterScreen />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/user-profile' element={<ProfileScreen />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} /> */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
