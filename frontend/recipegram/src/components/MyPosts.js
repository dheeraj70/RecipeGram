import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Card from './Card';

export default function MyPosts() {
  const navigate = useNavigate();
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
    <>
    <div className="container mt-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
      {allPosts.map((i)=>{
      return(<div onClick={()=>{navigate(`/home/post/${i.post_id}`)}} className="col d-flex justify-content-center"><Card title={i.post_title} backImg={(i.thumbURL=== null)?('/noimg.svg'):(i.thumbURL)}/></div>)
    })}
       
      </div>
    </div>
    
  </>
  )
}
