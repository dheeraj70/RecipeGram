import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

export default function Register({ setr }) {
  //const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async (e) => {
    
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
  
        },
        body: JSON.stringify({ username, password })
      });

      await response.json().then((dat)=>{
        if(response.status=== 400){
          alert(dat.message);
        }else if(response.status === 500){
          alert(dat.message);
        }else if(response.status === 200){
          alert(dat.message);
          setTimeout(()=>{setr(false)},100)
          
        }
      })
      //console.log('Registration successful:', responseData);

      //console.log(response.body.message)
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="login">
      <button className="backbtn" onClick={() => { setr(false) }}>
        <i className="fa-solid fa-arrow-left"></i>
      </button>
      <img src="RecipeGram-logos_transparent.png" alt="logo" className="loginlogo" />
      <form className="loginform" onSubmit={handleRegistration}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="logtext form-control"
            id="floatingInput"
            placeholder="User Name"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label htmlFor="floatingInput">User Name</label>
        </div>

        <div className="form-floating">
          <input
            type="password"
            className="logtext form-control"
            id="floatingPassword"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button type="submit" className="logsub btn btn-outline-secondary">Sign Up</button>
      </form>
    </div>
  );
}
