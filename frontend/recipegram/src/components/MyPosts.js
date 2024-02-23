import React,{useEffect, useState} from 'react'

import PostThumbs from './PostThumbs';

export default function MyPosts() {
  
  const [allPosts, setAllPosts]=useState([]);
  const [userDesc, setUserDesc]=useState("");
  useEffect(()=>{
    const fetchUserDesc = async()=>{
      const res = await fetch('http://localhost:8080/userdesc',{
      credentials: 'include',
    })
    var data = await res.json();
    setUserDesc(data);
    }
    fetchUserDesc();
    const fetchPosts = async()=>{
    const res = await fetch('http://localhost:8080/user-posts',{
      
      credentials: 'include',

    })
    var data = await res.json();
    setAllPosts(data);
  }
fetchPosts();
},[])
  return (
    <>
    <div className="container mt-4">
      <div className="profileDetails">
       <div className="proFilepic"><img className='propicc' src="/pro.jpg" alt="Profile" /></div>
      <div className="proDetails">
        <h1 className="proName">{userDesc.username}</h1>
        <div className="profileDesc">
          <div className="proDescOne"><h2 className='proDescHead'>{userDesc.postsCount}</h2><p>Recipes made</p></div>
          <div className="proDescOne"><h2 className='proDescHead'><i class="fa-solid fa-star"></i>5</h2><p>Rating</p></div>
          <div className="proDescOne"><h2 className='proDescHead'>{userDesc.subCount}</h2><p>Subscribers</p></div>

        </div>
        <div className="proSocial"><a href={userDesc.iglink}><i class="fa-brands fa-square-instagram"></i></a><a href={userDesc.ytlink}><i class="fa-brands fa-square-youtube"></i></a><a href={userDesc.lilink}><i class="fa-brands fa-linkedin"></i></a><a href={userDesc.twlink}><i class="fa-brands fa-square-twitter"></i></a></div>

        </div> 
      </div>
    </div>
    
    <PostThumbs allPosts={allPosts} listTitle={"Your Posts"}/>
    
  </>
  )
}
