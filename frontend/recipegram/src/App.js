import { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import MyPosts from './components/MyPosts';
import Post from './components/Post';
import Profile from './components/Profile';
import Feed from './components/Feed';
import MySubscriptions from './components/MySubscriptions';

import PostC from './components/PostC';
//import Register from './components/Register';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditProfile from './components/EditProfile';
import TopChefs from './components/TopChefs'
import ChefProfile from './components/ChefProfile';

function App() {
  //const [sessionChanged, setSessionChanged] = useState(false);



   //window.addEventListener('sessionchange', ());
//Make a timeout api call to check if the same user is logged!!!

  return (
    <>
    <BrowserRouter >
      <Routes>
        <Route path="/" element={<Login/>}/> 
        <Route path="/home" element={<Home/>}>
        <Route index element={<Feed/>}/>
        <Route path="subs" element={<MySubscriptions/>}/>
        <Route path="myposts" element={<MyPosts/>}/>
        <Route path="newpost" element={<Post/>}/>
        <Route path="post/:postId" element={<PostC/>}/>
        <Route path="editprofile" element={<EditProfile/>}/>
        <Route path="topchefs" element={<TopChefs/>}/>
        <Route path="chefs/:userid" element={<ChefProfile/>}/>

          </Route> 
       
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
