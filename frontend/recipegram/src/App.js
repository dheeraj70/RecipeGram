import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
//import Register from './components/Register';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  //const [sessionChanged, setSessionChanged] = useState(false);



   //window.addEventListener('sessionchange', ());
//Make a timeout api call to check if the same user is logged!!!

  return (
    <>
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Login/>}/> 
        <Route path="/home" element={<Home/>}/> 
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
