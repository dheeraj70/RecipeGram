import React, { useEffect, useState } from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Feed() {
  const navigate = useNavigate();
  const[subbedPosts,setSubbedPosts]=useState([]);
  const[NewPosts,setNewPosts]=useState([]);
  //const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);


  const fetchNewPosts = async () => {
    var newPosts=[];
    try {
      const response = await fetch(`http://localhost:8080/all-posts/${page}`);
      newPosts = await response.json();
      //console.log(newPosts);
      if (newPosts.length === 0) {
        setHasMore(false); // No more posts to load
      } else {
        
        
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }finally{
      setNewPosts(prevPosts => [...prevPosts, ...newPosts]);
    }
  };




  const fetchSubbedPosts = async()=>{
    const res = await fetch('http://localhost:8080/subscriber-posts',{
      credentials: "include"
    })
    var dat = await res.json();
    //console.log(dat);
    setSubbedPosts(dat);
  }


  useEffect(() => {
    fetchSubbedPosts();

    
  }, []);
  
  useEffect(() => {

    fetchNewPosts();
    
  }, [page]);

  return (
    <>
    <div className="container feed_post_cont">
    
    <h5 className='text-center mt-3'>Posts from your subscriptions</h5>
      {subbedPosts.map((post)=>{
        return(
          <div key={post.post_id} className="card mb-3 mt-3 cp" onClick={()=>{navigate(`/home/post/${post.post_id}`)}}>
  <img className="card-img-top feed_img" src={(post.thumbURL=== null)?('/noimg.svg'):(post.thumbURL)} alt="Card image cap"/>
  <div className="card-body">
    <h5 className="card-title mb-1">{post.post_title}</h5>
    <p className="card-text mb-1">{`Author: ${post.username}`}</p>
    <p className="card-text"><small className="text-muted">{`Date posted: ${ new Date(post.date_time).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`}</small></p>
  </div>
</div>

        )
      })}
      <hr />
      
      
    <h5 className='text-center'>New Recipes on RecipeGram</h5>
    <div>
      <InfiniteScroll
        dataLength={NewPosts.length}
        next={()=>{setPage(prevPage => prevPage + 1);}}
        hasMore={hasMore}
      
        loader={<div className='text-center'><img src="/Loading.svg" alt="load" style={{height: '70px', width: '70px'}}/></div>
      }
        endMessage={<h3 className="text-center">Thats all the folks! 	
        &#128539;</h3>}
      >
        {NewPosts.map((post)=>{
        return(
          <div key={post.post_id} className="card mb-3 mt-3 cp" onClick={()=>{navigate(`/home/post/${post.post_id}`)}}>
  <img className="card-img-top feed_img" src={(post.thumbURL=== null)?('/noimg.svg'):(post.thumbURL)} alt="Card image cap"/>
  <div className="card-body">
    <h5 className="card-title mb-1">{post.post_title}</h5>
    <p className="card-text mb-1">{`Author: ${post.username}`}</p>
    <p className="card-text"><small className="text-muted">{`Date posted: ${ new Date(post.date_time).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`}</small></p>
  </div>
</div>

        )
      })}
      </InfiniteScroll>
    </div>
</div>    
    
    
    
    </>
  )
}
