import React,{useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Card from './Card';

export default function ChefProfile() {
  const navigate = useNavigate();
  const params = useParams();
  const chefID = params.userid;
  const [allPosts, setAllPosts]=useState([]);
  const [userDesc, setUserDesc]=useState("");
  useEffect(()=>{
    const fetchUserDesc = async()=>{
      const res = await fetch(`http://localhost:8080/chefs/${chefID}`,{
      credentials: 'include',
    })
    var data = await res.json();
    setUserDesc(data);
    }
    fetchUserDesc();
    const fetchPosts = async()=>{
    const res = await fetch(`http://localhost:8080/chef-posts/${chefID}`,{
      
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
        </div>
        <div className="proSocial"><a href={userDesc.iglink}><i class="fa-brands fa-square-instagram"></i></a><a href={userDesc.ytlink}><i class="fa-brands fa-square-youtube"></i></a><a href={userDesc.lilink}><i class="fa-brands fa-linkedin"></i></a><a href={userDesc.twlink}><i class="fa-brands fa-square-twitter"></i></a></div>

        </div> 
      </div>
    </div>
    
    <div className="container mt-4">
    <hr className='mt-1 mb-1'/>
    <h2 className='text-center pt-3 pb-3 m-0'>Your Posts</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
      {allPosts.map((i)=>{
      return(<div onClick={()=>{navigate(`/home/post/${i.post_id}`)}} className="col d-flex justify-content-center"><Card title={i.post_title} backImg={(i.thumbURL=== null)?('/noimg.svg'):(i.thumbURL)}/></div>)
    })}
       
      </div>
    </div>
    
  </>
  )
}
