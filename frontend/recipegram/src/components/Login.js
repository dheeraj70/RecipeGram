import React, { useState } from 'react'
import Signin from './Signin'
import Register from './Register';
//import {  Routes, Route } from "react-router-dom";

export default function Login() {
  const [reg, setreg] = useState(false);
  return (
    <div className="log">

      {(reg)?<Register setr={setreg}/>:<Signin setr={setreg}/>}
      
  
<div className="logimg">

</div>
</div>
  )
}
