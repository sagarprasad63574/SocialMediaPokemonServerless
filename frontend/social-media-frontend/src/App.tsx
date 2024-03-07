import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";

import LoginContainer from './components/Auth/Login/LoginContainer';
import TestComponent from './components/TestComponent/TestComponent';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<TestComponent />}></Route>
        <Route path='/login' element={<LoginContainer />}></Route>
      </Routes>
    </div>
  );
}

export default App;
