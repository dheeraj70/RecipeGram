import React, {useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';

export default function PostC() {
    const outputRef = useRef(null);
    const titleRef = useRef(null);
    const params = useParams();
    const postId = params.postId;
    useEffect(()=>{
        const fetchPosts = async()=>{
            const res = await fetch(`http://localhost:8080/posts/${postId}`,{
              credentials: 'include',
            })
            var data = await res.json();
            console.log(data);
            titleRef.current.innerText= data.post_title;
            outputRef.current.innerHTML=data.post_cont;
          }
        fetchPosts();
    },[postId])
  return (<>
  
  <div className="post">
  <h2 className='postTitle' ref={titleRef}></h2>
  <div id="container" className="post-output" 
                ref={outputRef} 
                ></div></div>
  </>
    
  )
}
