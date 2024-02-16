import React,{useEffect, useState} from 'react'

export default function MyPosts() {
  const [allPosts, setAllPosts]=useState([]);
  useEffect(()=>{
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
    <div>{allPosts.map((i)=>{
      return(i.post_title)
    })}</div>
  )
}
