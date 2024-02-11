import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import Signin from './Signin'
import Register from './Register';
//import {  Routes, Route } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [reg, setreg] = useState(false);
  useEffect(() => {
    const ff = async()=>{
      
    try {
      const response = await fetch('http://localhost:8080/',{
        credentials: 'include'
      });
      
      if (response.ok) {
        navigate('/home');
      }
      
     
      
    } catch (error) {
      console.error('Error during GET request:', error);
    }
  }
  ff();
  
  }, []);

  return (
    <div className="log">

      {(reg)?<Register setr={setreg}/>:<Signin setr={setreg}/>}
      
  
<div className="logimg">

</div>
</div>
  )
}
