import React from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function PostThumbs({allPosts, listTitle, next, hasmore}) {
    const navigate = useNavigate();
  return (
    <>
  <div className="container mt-4">
    <hr className='mt-1 mb-1'/>
    <h2 className='text-center pt-3 pb-3 m-0'>{listTitle}</h2>
    </div>
    <InfiniteScroll
        dataLength={allPosts.length}
        next={next}
        hasMore={hasmore}
      
        loader={<div className='text-center'><img src="/Loading.svg" alt="load" style={{height: '70px', width: '70px'}}/></div>
      }
        endMessage={<hr/>}
      >
        <div className="container mt-4">
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
      {allPosts.map((i)=>{
      return(<div key={i.post_id} onClick={()=>{navigate(`/home/post/${i.post_id}`)}} className="col d-flex justify-content-center"><Card title={i.post_title} backImg={(i.thumbURL=== null)?('/noimg.svg'):(i.thumbURL)}/></div>)
    })}
       
     </div>
     </div>
    </InfiniteScroll>
     
    </>
  )
}
