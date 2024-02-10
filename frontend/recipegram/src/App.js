import './App.css';
import Login from './components/Login';
import Home from './components/Home';
//import Register from './components/Register';

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

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
