import React, {useEffect, useRef} from 'react';
import { useParams ,useNavigate} from 'react-router-dom';

export default function PostC() {
  const navigate = useNavigate();
    const outputRef = useRef(null);
    const titleRef = useRef(null);
    const authRef = useRef(null);
    const dateRef = useRef(null);
    const params = useParams();
    const postId = params.postId;
    var userid =null;
    useEffect(()=>{
        const fetchPosts = async()=>{
            const res = await fetch(`http://localhost:8080/posts/${postId}`,{
              credentials: 'include',
            })
            var data = await res.json();
            console.log(data);
            titleRef.current.innerText= data.post_title;
            dateRef.current.innerText = `Date Posted: ${new Date(data.date_time).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`;
            outputRef.current.innerHTML=data.post_cont;
          }
        fetchPosts();
        const fetchAuthor = async()=>{
          const res = await fetch(`http://localhost:8080/user-by-post/${postId}`,{
              credentials: 'include',
            })
            var data = await res.json();
            console.log(data);
            userid= data.userId;
            authRef.current.innerText= data.username;
        }
        fetchAuthor();
    },[postId])
  return (<>
  
  <div className="post">
  <div className='postTitle' > <h2 className='mb-1' ref={titleRef}></h2>
  <div className="d-flex align-items-center justify-content-center">
    <p className='m-0'>Author: </p>
    <h5 onClick={()=>{
      navigate(`/home/chefs/${userid}`)
    }} className='m-0 ps-1 cp' ref={authRef} ></h5>
    
    </div> <p className='mb-1' style={{textAlign: 'center', color:'#494949'}} ref={dateRef}></p>
    </div>
  
  <div id="container" className="post-output" 
                ref={outputRef} 
                ></div></div>
  </>
    
  )
}
