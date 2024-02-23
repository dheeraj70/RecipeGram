import React from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

export default function PostThumbs({allPosts, listTitle}) {
    const navigate = useNavigate();
  return (
    <div className="container mt-4">
    <hr className='mt-1 mb-1'/>
    <h2 className='text-center pt-3 pb-3 m-0'>{listTitle}</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
      {allPosts.map((i)=>{
      return(<div onClick={()=>{navigate(`/home/post/${i.post_id}`)}} className="col d-flex justify-content-center"><Card title={i.post_title} backImg={(i.thumbURL=== null)?('/noimg.svg'):(i.thumbURL)}/></div>)
    })}
       
      </div>
    </div>
  )
}
