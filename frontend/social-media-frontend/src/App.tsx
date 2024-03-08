import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, Routes} from 'react-router-dom';

import LoginContainer from './components/Auth/LoginContainer';
import TestComponent from './components/TestComponent/TestComponent';
import RegisterContainer from './components/Auth/RegisterContainer';
import TeamsContainer from './components/Teams/TeamsContainer';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<TestComponent />}></Route>
        <Route path='/login' element={<LoginContainer />}></Route>
        <Route path='/register' element={<RegisterContainer />}></Route>
        <Route path='/teams' element={<TeamsContainer />}></Route>
      </Routes>
    </div>
  );
}

export default App;
